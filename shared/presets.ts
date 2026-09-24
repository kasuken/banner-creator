// Banner presets shared by the web app (src/) and the MCP server (api/).

export type AspectRatio =
    | 'blog-16:9'
    | 'blog-1000:420'
    | 'linkedin-square'
    | 'linkedin-landscape'
    | 'linkedin-article-featured'
    | 'linkedin-article-banner'
    | 'linkedin-blog-link';

export type AspectRatioCategory = 'blog' | 'linkedin';

export type ImageFitMode = 'cover' | 'stretch';

export interface AspectRatioConfig {
    id: AspectRatio;
    category: AspectRatioCategory;
    name: string;
    width: number;
    height: number;
    description: string;
}

export const ASPECT_RATIOS: AspectRatioConfig[] = [
    { id: 'blog-16:9', category: 'blog', name: '16:9', width: 1600, height: 900, description: 'Standard Blog' },
    { id: 'blog-1000:420', category: 'blog', name: '1000:420', width: 1000, height: 420, description: 'dev.to Banner' },
    { id: 'linkedin-square', category: 'linkedin', name: 'Square Post', width: 1080, height: 1080, description: 'Single/Multi-Image' },
    { id: 'linkedin-landscape', category: 'linkedin', name: 'Landscape Post', width: 1920, height: 1080, description: 'Single/Multi-Image' },
    { id: 'linkedin-article-featured', category: 'linkedin', name: 'Article Featured', width: 1200, height: 644, description: 'Article Header' },
    { id: 'linkedin-article-banner', category: 'linkedin', name: 'Article Banner', width: 600, height: 322, description: 'Compact Banner' },
    { id: 'linkedin-blog-link', category: 'linkedin', name: 'Blog Link', width: 1200, height: 627, description: 'Shared Links' },
];

export const ASPECT_RATIO_IDS = ASPECT_RATIOS.map((r) => r.id) as [AspectRatio, ...AspectRatio[]];

export const getAspectRatio = (id: AspectRatio): AspectRatioConfig =>
    ASPECT_RATIOS.find((r) => r.id === id) ?? ASPECT_RATIOS[0];

export interface FontConfig {
    name: string;
    value: string;
}

export const FONTS: FontConfig[] = [
    { name: 'Arial', value: 'Arial, sans-serif' },
    { name: 'Helvetica', value: 'Helvetica, sans-serif' },
    { name: 'Georgia', value: 'Georgia, serif' },
    { name: 'Times New Roman', value: '"Times New Roman", Times, serif' },
    { name: 'Courier New', value: '"Courier New", Courier, monospace' },
    { name: 'Verdana', value: 'Verdana, sans-serif' },
    { name: 'Impact', value: 'Impact, sans-serif' },
    { name: 'Comic Sans MS', value: '"Comic Sans MS", cursive' },
];

export const IMAGE_FIT_MODES: [ImageFitMode, ...ImageFitMode[]] = ['cover', 'stretch'];

export const FONT_SIZE_RANGE = { min: 32, max: 160 };
export const BLUR_RANGE = { min: 0, max: 20 };
export const MAX_TEXT_LENGTH = 500;

export const DEFAULT_BACKGROUND_IMAGE =
    'https://plus.unsplash.com/premium_photo-1661873863027-51b409f112f5?q=80&w=1428&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

export interface BannerSettings {
    text: string;
    fontFamily: string;
    fontSize: number;
    fontColor: string;
    textStrokeColor: string;
    aspectRatio: AspectRatio;
    blurAmount: number;
    imageFit: ImageFitMode;
    backgroundImage: string;
}

export const DEFAULT_SETTINGS: BannerSettings = {
    text: 'Create Beautiful Banners',
    fontFamily: FONTS[0].value,
    fontSize: 72,
    fontColor: '#ffffff',
    textStrokeColor: '#000000',
    aspectRatio: 'blog-1000:420',
    blurAmount: 8,
    imageFit: 'cover',
    backgroundImage: DEFAULT_BACKGROUND_IMAGE,
};

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

const clamp = (value: number, { min, max }: { min: number; max: number }) =>
    Math.min(max, Math.max(min, value));

/**
 * Query-string keys used for "edit in browser" deep links:
 * text, font, size, color, stroke, format, blur, fit, image
 */
export const settingsFromSearchParams = (params: URLSearchParams): BannerSettings => {
    const settings = { ...DEFAULT_SETTINGS };

    const text = params.get('text');
    if (text !== null) settings.text = text.slice(0, MAX_TEXT_LENGTH);

    const font = params.get('font');
    const matchedFont = font && FONTS.find((f) => f.value === font || f.name.toLowerCase() === font.toLowerCase());
    if (matchedFont) settings.fontFamily = matchedFont.value;

    const size = Number(params.get('size'));
    if (params.has('size') && Number.isFinite(size)) settings.fontSize = clamp(Math.round(size), FONT_SIZE_RANGE);

    const color = params.get('color');
    if (color && HEX_COLOR.test(color)) settings.fontColor = color;

    const stroke = params.get('stroke');
    if (stroke && HEX_COLOR.test(stroke)) settings.textStrokeColor = stroke;

    const format = params.get('format');
    if (format && ASPECT_RATIO_IDS.includes(format as AspectRatio)) settings.aspectRatio = format as AspectRatio;

    const blur = Number(params.get('blur'));
    if (params.has('blur') && Number.isFinite(blur)) settings.blurAmount = clamp(Math.round(blur), BLUR_RANGE);

    const fit = params.get('fit');
    if (fit && IMAGE_FIT_MODES.includes(fit as ImageFitMode)) settings.imageFit = fit as ImageFitMode;

    const image = params.get('image');
    if (image !== null && (image === '' || /^https:\/\//i.test(image))) settings.backgroundImage = image;

    return settings;
};

export const settingsToSearchParams = (settings: BannerSettings): URLSearchParams => {
    const font = FONTS.find((f) => f.value === settings.fontFamily);
    return new URLSearchParams({
        text: settings.text,
        font: font ? font.name : settings.fontFamily,
        size: String(settings.fontSize),
        color: settings.fontColor,
        stroke: settings.textStrokeColor,
        format: settings.aspectRatio,
        blur: String(settings.blurAmount),
        fit: settings.imageFit,
        image: settings.backgroundImage,
    });
};
