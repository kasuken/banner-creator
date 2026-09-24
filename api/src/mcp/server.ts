import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import {
    ASPECT_RATIOS,
    ASPECT_RATIO_IDS,
    BLUR_RANGE,
    DEFAULT_SETTINGS,
    FONTS,
    FONT_SIZE_RANGE,
    IMAGE_FIT_MODES,
    MAX_TEXT_LENGTH,
    settingsToSearchParams,
    type BannerSettings,
} from '../../../shared/presets';
import { renderBannerImage, UserFacingError } from './render';
import { getPhotoForUse, searchPhotos } from './unsplash';

const FONT_NAMES = FONTS.map((f) => f.name) as [string, ...string[]];
const HEX_COLOR = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Use a 6-digit hex color like #ffffff');

const siteUrl = () => (process.env.PUBLIC_SITE_URL?.trim() || 'https://www.bannercreator.pro').replace(/\/+$/, '');

const toolError = (err: unknown): CallToolResult => {
    const message = err instanceof UserFacingError ? err.message : 'Unexpected server error.';
    if (!(err instanceof UserFacingError)) console.error(err);
    return { isError: true, content: [{ type: 'text', text: message }] };
};

const json = (value: unknown): CallToolResult => ({
    content: [{ type: 'text', text: JSON.stringify(value, null, 2) }],
});

export const createServer = (): McpServer => {
    const server = new McpServer({ name: 'banner-creator', version: '1.0.0' });

    server.registerTool(
        'list_banner_options',
        {
            title: 'List banner options',
            description: 'Lists the available banner formats (platform sizes), fonts, image fit modes, and default values and ranges for render_banner.',
            annotations: { readOnlyHint: true, openWorldHint: false },
        },
        async () =>
            json({
                formats: ASPECT_RATIOS.map(({ id, category, name, width, height, description }) => ({
                    id, category, name, width, height, description,
                })),
                fonts: FONT_NAMES,
                fit_modes: IMAGE_FIT_MODES,
                font_size: { ...FONT_SIZE_RANGE, default: DEFAULT_SETTINGS.fontSize },
                blur: { ...BLUR_RANGE, default: DEFAULT_SETTINGS.blurAmount },
                max_text_length: MAX_TEXT_LENGTH,
                defaults: {
                    format: DEFAULT_SETTINGS.aspectRatio,
                    font: FONTS[0].name,
                    font_color: DEFAULT_SETTINGS.fontColor,
                    stroke_color: DEFAULT_SETTINGS.textStrokeColor,
                    fit: DEFAULT_SETTINGS.imageFit,
                },
            })
    );

    server.registerTool(
        'search_background_images',
        {
            title: 'Search background images',
            description:
                'Searches Unsplash for background photos. Pass a result id to render_banner as unsplash_photo_id. ' +
                'When publishing a banner that uses an Unsplash photo, credit the photographer.',
            inputSchema: {
                query: z.string().min(1).max(100).describe('Search terms, e.g. "mountains at sunset"'),
                per_page: z.number().int().min(1).max(30).default(10).describe('Number of results (1-30)'),
                orientation: z.enum(['landscape', 'portrait', 'squarish']).optional().describe('Filter by photo orientation'),
            },
            annotations: { readOnlyHint: true, openWorldHint: true },
        },
        async ({ query, per_page, orientation }) => {
            try {
                return json({ results: await searchPhotos(query, per_page, orientation) });
            } catch (err) {
                return toolError(err);
            }
        }
    );

    server.registerTool(
        'render_banner',
        {
            title: 'Render banner',
            description:
                'Renders a banner image: centered, bold, auto-wrapped text over a blurred, darkened background photo. ' +
                'Returns the image plus a link to open the same banner in the web editor. ' +
                'Background: pass unsplash_photo_id (from search_background_images) or image_url; if neither is given ' +
                'the default background is used, and plain_background renders a flat gray background instead.',
            inputSchema: {
                text: z.string().min(1).max(MAX_TEXT_LENGTH).describe('Banner text. Use \\n for manual line breaks.'),
                format: z.enum(ASPECT_RATIO_IDS).default(DEFAULT_SETTINGS.aspectRatio).describe('Banner format id (see list_banner_options)'),
                font: z.enum(FONT_NAMES).default(FONTS[0].name).describe('Font family'),
                font_size: z.number().int().min(FONT_SIZE_RANGE.min).max(FONT_SIZE_RANGE.max).default(DEFAULT_SETTINGS.fontSize).describe('Font size in px'),
                font_color: HEX_COLOR.default(DEFAULT_SETTINGS.fontColor).describe('Text fill color'),
                stroke_color: HEX_COLOR.default(DEFAULT_SETTINGS.textStrokeColor).describe('Text outline color'),
                blur: z.number().int().min(BLUR_RANGE.min).max(BLUR_RANGE.max).default(DEFAULT_SETTINGS.blurAmount).describe('Background blur in px'),
                fit: z.enum(IMAGE_FIT_MODES).default(DEFAULT_SETTINGS.imageFit).describe('cover = crop to fill, stretch = fill and distort'),
                unsplash_photo_id: z.string().max(64).optional().describe('Unsplash photo id from search_background_images'),
                image_url: z.string().url().max(2048).optional().describe('Public https URL of a background image'),
                plain_background: z.boolean().default(false).describe('Ignore images and use a flat gray background'),
                output: z.enum(['png', 'jpeg']).default('png').describe('Image format; jpeg is smaller'),
            },
            annotations: { readOnlyHint: true, openWorldHint: true },
        },
        async (args) => {
            try {
                let backgroundImage = DEFAULT_SETTINGS.backgroundImage;
                let attribution: string | undefined;

                if (args.plain_background) {
                    backgroundImage = '';
                } else if (args.unsplash_photo_id) {
                    const photo = await getPhotoForUse(args.unsplash_photo_id);
                    backgroundImage = photo.image_url;
                    attribution = `Photo by ${photo.photographer} (${photo.photographer_url}) on Unsplash (${photo.unsplash_url})`;
                } else if (args.image_url) {
                    backgroundImage = args.image_url;
                }

                const settings: BannerSettings = {
                    text: args.text,
                    fontFamily: FONTS.find((f) => f.name === args.font)!.value,
                    fontSize: args.font_size,
                    fontColor: args.font_color,
                    textStrokeColor: args.stroke_color,
                    aspectRatio: args.format,
                    blurAmount: args.blur,
                    imageFit: args.fit,
                    backgroundImage,
                };

                const banner = await renderBannerImage(settings, args.output);
                const editUrl = `${siteUrl()}/?${settingsToSearchParams(settings)}`;
                const summary = [
                    `Rendered ${banner.width}x${banner.height} ${args.output.toUpperCase()} banner (format: ${args.format}).`,
                    `Edit in browser: ${editUrl}`,
                    attribution && `Attribution: ${attribution}`,
                ].filter(Boolean).join('\n');

                return {
                    content: [
                        { type: 'image', data: banner.data.toString('base64'), mimeType: banner.mimeType },
                        { type: 'text', text: summary },
                    ],
                };
            } catch (err) {
                return toolError(err);
            }
        }
    );

    return server;
};
