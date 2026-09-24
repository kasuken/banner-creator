import { createCanvas, GlobalFonts, loadImage, type Image } from '@napi-rs/canvas';
import { lookup } from 'node:dns/promises';
import { readFileSync } from 'node:fs';
import { isIP } from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getAspectRatio, type BannerSettings } from '../../../shared/presets';
import { renderBanner, type BannerContext2D } from '../../../shared/renderBanner';

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 10_000;
const MAX_REDIRECTS = 3;

export class UserFacingError extends Error {}

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

const isPrivateAddress = (address: string): boolean => {
    if (isIP(address) === 6) {
        const a = address.toLowerCase();
        if (a.startsWith('::ffff:')) return isPrivateAddress(a.slice(7));
        return a === '::1' || a === '::' || a.startsWith('fc') || a.startsWith('fd') || a.startsWith('fe80');
    }
    const [p0, p1] = address.split('.').map(Number);
    return (
        p0 === 0 ||
        p0 === 10 ||
        p0 === 127 ||
        (p0 === 100 && p1 >= 64 && p1 <= 127) ||
        (p0 === 169 && p1 === 254) ||
        (p0 === 172 && p1 >= 16 && p1 <= 31) ||
        (p0 === 192 && p1 === 168) ||
        p0 >= 224
    );
};

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

const fetchImageBytes = async (rawUrl: string): Promise<Buffer> => {
    let url = await assertPublicHttpsUrl(rawUrl);
    const signal = AbortSignal.timeout(FETCH_TIMEOUT_MS);

    for (let redirects = 0; ; redirects++) {
        const response = await fetch(url, { redirect: 'manual', signal }).catch((err: Error) => {
            throw new UserFacingError(`Could not download image: ${err.message}`);
        });

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
