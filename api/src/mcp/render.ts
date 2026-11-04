import { createCanvas, GlobalFonts, loadImage, type Image } from '@napi-rs/canvas';
import { lookup } from 'node:dns/promises';
import { readFileSync } from 'node:fs';
import { BlockList, isIP } from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Agent, fetch as undiciFetch } from 'undici';
import { getAspectRatio, type BannerSettings } from '../../../shared/presets';
import { renderBanner, type BannerContext2D } from '../../../shared/renderBanner';
import { UserFacingError } from '../errors';

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 10_000;
const MAX_REDIRECTS = 3;

// dist/functions/mcp.js → dist/fonts
const FONTS_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../fonts');

let fontsLoaded = false;

const ensureFonts = () => {
    if (fontsLoaded) return;
    const manifest: { file: string; families: string[] }[] = JSON.parse(
        readFileSync(path.join(FONTS_DIR, 'manifest.json'), 'utf8')
    );
    for (const { file, families } of manifest) {
        for (const family of families) {
            GlobalFonts.registerFromPath(path.join(FONTS_DIR, file), family);
        }
    }
    fontsLoaded = true;
};

// Every address range a user-supplied image URL must never reach: loopback, link-local (including
// the cloud metadata endpoint), private, CGNAT, documentation, benchmarking, multicast and reserved.
const blockedRanges = new BlockList();
const BLOCKED_IPV4_RANGES: readonly [string, number][] = [
    ['0.0.0.0', 8],
    ['10.0.0.0', 8],
    ['100.64.0.0', 10],
    ['127.0.0.0', 8],
    ['169.254.0.0', 16],
    ['172.16.0.0', 12],
    ['192.0.0.0', 24],
    ['192.0.2.0', 24],
    ['192.88.99.0', 24],
    ['192.168.0.0', 16],
    ['198.18.0.0', 15],
    ['198.51.100.0', 24],
    ['203.0.113.0', 24],
    ['224.0.0.0', 4],
    ['240.0.0.0', 4],
];
for (const [address, prefix] of BLOCKED_IPV4_RANGES) blockedRanges.addSubnet(address, prefix, 'ipv4');

const BLOCKED_IPV6_RANGES: readonly [string, number][] = [
    ['::', 128],
    ['::1', 128],
    ['fc00::', 7],
    ['fe80::', 10],
    ['fec0::', 10],
    ['ff00::', 8],
];
for (const [address, prefix] of BLOCKED_IPV6_RANGES) blockedRanges.addSubnet(address, prefix, 'ipv6');

const isPrivateAddress = (address: string): boolean => {
    const family = isIP(address);
    if (family === 4) return blockedRanges.check(address, 'ipv4');
    if (family === 6) {
        // IPv4-mapped IPv6 (::ffff:127.0.0.1) has to be checked against the IPv4 ranges.
        const mapped = /^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/i.exec(address);
        if (mapped) return blockedRanges.check(mapped[1], 'ipv4');
        return blockedRanges.check(address, 'ipv6');
    }
    // Not an IP address at all: refuse rather than guess.
    return true;
};

/**
 * DNS lookup used for the actual outbound connection, not only for a pre-flight check. The address
 * validated here is the address `net` connects to, so a hostname can't answer with a public IP when
 * checked and a private one when fetched (DNS rebinding).
 */
const publicOnlyLookup = (
    hostname: string,
    options: { all?: boolean },
    callback: (err: Error | null, address: unknown, family?: number) => void
): void => {
    lookup(hostname, { all: true, verbatim: true })
        .then((addresses) => {
            const allowed = addresses.filter(({ address }) => !isPrivateAddress(address));
            if (allowed.length === 0) {
                throw new UserFacingError('Image URL must point to a public host.');
            }
            if (options.all) callback(null, allowed);
            else callback(null, allowed[0].address, allowed[0].family);
        })
        .catch((err: Error) => {
            callback(err, '');
        });
};

const imageAgent = new Agent({
    // undici passes `connect.lookup` through to net/tls. The callback handles both the single
    // address and the all-addresses shape, which its type doesn't express.
    connect: { lookup: publicOnlyLookup as unknown as never },
});

const assertPublicHttpsUrl = async (raw: string): Promise<URL> => {
    let url: URL;
    try {
        url = new URL(raw);
    } catch {
        throw new UserFacingError(`Invalid image URL: ${raw}`);
    }
    if (url.protocol !== 'https:') throw new UserFacingError('Image URL must use https.');
    const host = url.hostname.replace(/^\[|\]$/g, '');
    if (isIP(host) || host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.internal')) {
        throw new UserFacingError('Image URL must use a public host name.');
    }
    const addresses = await lookup(host, { all: true }).catch(() => {
        throw new UserFacingError(`Could not resolve image host: ${host}`);
    });
    if (addresses.some(({ address }) => isPrivateAddress(address))) {
        throw new UserFacingError('Image URL must point to a public host.');
    }
    return url;
};

/** Unwraps undici's `TypeError: fetch failed` so the user sees the underlying reason. */
const describeFetchError = (err: unknown): string => {
    let current: unknown = err;
    for (let depth = 0; depth < 5 && current instanceof Error; depth++) {
        if (current instanceof UserFacingError) return current.message;
        if (!current.cause || current.cause === current) break;
        current = current.cause;
    }
    return err instanceof Error ? err.message : 'unknown error';
};

const fetchImageBytes = async (rawUrl: string): Promise<Buffer> => {
    let url = await assertPublicHttpsUrl(rawUrl);
    const signal = AbortSignal.timeout(FETCH_TIMEOUT_MS);

    for (let redirects = 0; ; redirects++) {
        const response = await undiciFetch(url, { redirect: 'manual', signal, dispatcher: imageAgent }).catch(
            (err: Error) => {
                throw new UserFacingError(`Could not download image: ${describeFetchError(err)}`);
            }
        );

        if (response.status >= 300 && response.status < 400 && response.headers.get('location')) {
            if (redirects >= MAX_REDIRECTS) throw new UserFacingError('Image URL redirected too many times.');
            url = await assertPublicHttpsUrl(new URL(response.headers.get('location')!, url).toString());
            continue;
        }
        if (!response.ok) throw new UserFacingError(`Could not download image (HTTP ${response.status}).`);

        const contentType = response.headers.get('content-type') ?? '';
        if (!contentType.startsWith('image/')) {
            throw new UserFacingError(`URL did not return an image (content-type: ${contentType || 'unknown'}).`);
        }
        if (Number(response.headers.get('content-length') ?? 0) > MAX_IMAGE_BYTES) {
            throw new UserFacingError('Image is larger than 8 MB.');
        }

        const chunks: Uint8Array[] = [];
        let total = 0;
        for await (const chunk of response.body as unknown as AsyncIterable<Uint8Array>) {
            total += chunk.byteLength;
            if (total > MAX_IMAGE_BYTES) throw new UserFacingError('Image is larger than 8 MB.');
            chunks.push(chunk);
        }
        return Buffer.concat(chunks);
    }
};

export type OutputFormat = 'png' | 'jpeg';

export interface RenderedBanner {
    data: Buffer;
    mimeType: string;
    width: number;
    height: number;
}

export const renderBannerImage = async (settings: BannerSettings, output: OutputFormat): Promise<RenderedBanner> => {
    ensureFonts();

    let image: Image | null = null;
    if (settings.backgroundImage) {
        const bytes = await fetchImageBytes(settings.backgroundImage);
        image = await loadImage(bytes).catch(() => {
            throw new UserFacingError('The background image could not be decoded.');
        });
    }

    const { width, height } = getAspectRatio(settings.aspectRatio);
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    renderBanner(ctx as unknown as BannerContext2D, image, {
        width,
        height,
        text: settings.text,
        fontFamily: settings.fontFamily,
        fontSize: settings.fontSize,
        fontColor: settings.fontColor,
        textStrokeColor: settings.textStrokeColor,
        blurAmount: settings.blurAmount,
        imageFit: settings.imageFit,
    });

    const data = output === 'jpeg' ? await canvas.encode('jpeg', 90) : await canvas.encode('png');
    return { data, mimeType: output === 'jpeg' ? 'image/jpeg' : 'image/png', width, height };
};
