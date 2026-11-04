// Canvas drawing logic shared by the browser preview and the server-side MCP renderer.
// Typed against a minimal 2D context so it works with both the DOM canvas and @napi-rs/canvas.

import type { ImageFitMode } from './presets';

export interface BannerImage {
    width: number;
    height: number;
}

export interface BannerContext2D {
    readonly canvas: unknown;
    font: string;
    textAlign: string;
    textBaseline: string;
    strokeStyle: unknown;
    fillStyle: unknown;
    lineWidth: number;
    lineJoin: string;
    miterLimit: number;
    filter: string;
    clearRect(x: number, y: number, w: number, h: number): void;
    fillRect(x: number, y: number, w: number, h: number): void;
    measureText(text: string): { width: number };
    strokeText(text: string, x: number, y: number): void;
    fillText(text: string, x: number, y: number): void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    drawImage(image: any, ...args: number[]): void;
}

export interface RenderOptions {
    width: number;
    height: number;
    text: string;
    fontFamily: string;
    fontSize: number;
    fontColor: string;
    textStrokeColor: string;
    blurAmount: number;
    imageFit: ImageFitMode;
}

export interface TextLayout {
    lines: string[];
    /** Font size actually drawn with, after shrinking the text to fit. */
    fontSize: number;
    lineHeight: number;
}

const FALLBACK_BACKGROUND = '#f3f4f6';

/** Share of the canvas width the text block may use. */
const TEXT_WIDTH_RATIO = 0.9;
/** Share of the canvas height the text block may use. */
const TEXT_HEIGHT_RATIO = 0.9;
const LINE_HEIGHT_RATIO = 1.3;
/** Auto-fit never shrinks below this size, even if the text still overflows. */
export const MIN_FONT_SIZE = 12;
const LINE_JOIN = 'round';
const MITER_LIMIT = 2;
/** How far past the canvas the blurred background is drawn, as a multiple of the blur radius. */
const BLUR_OVERSCAN = 2;

/** Text outline width for a given font size: a hairline at 16px up to 10px at 160px. */
export const strokeWidth = (fontSize: number): number => Math.max(1, fontSize / 16);

/**
 * Draws the background image filling the canvas, overscanned by `pad` pixels on every side so a
 * blur filter has real pixels to sample at the edges instead of the transparency outside the canvas.
 */
const drawBackgroundImage = (
    ctx: BannerContext2D,
    image: BannerImage,
    opts: RenderOptions,
    pad: number
): void => {
    const { width, height } = opts;
    const dx = pad ? -pad : 0;
    const dy = pad ? -pad : 0;
    const dw = width + pad * 2;
    const dh = height + pad * 2;

    if (opts.imageFit === 'cover') {
        const imgRatio = image.width / image.height;
        const canvasRatio = width / height;
        let sx = 0, sy = 0, sw = image.width, sh = image.height;
        if (imgRatio > canvasRatio) {
            sw = image.height * canvasRatio;
            sx = (image.width - sw) / 2;
        } else {
            sh = image.width / canvasRatio;
            sy = (image.height - sh) / 2;
        }
        ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
        return;
    }

    ctx.drawImage(image, dx, dy, dw, dh);
};

/**
 * Draws the full banner. Pass `image = null` when there is no background image
 * or it failed to load; a gray background is drawn instead.
 * The caller is responsible for sizing the canvas to `opts.width` x `opts.height`.
 */
export const renderBanner = (ctx: BannerContext2D, image: BannerImage | null, opts: RenderOptions): void => {
    const { width, height } = opts;

    ctx.clearRect(0, 0, width, height);

    if (image) {
        drawBackgroundImage(ctx, image, opts, 0);

        // Blur a fresh copy of the image, drawn overscanned so the filter samples image pixels
        // rather than the emptiness outside the canvas. Blurring the canvas onto itself faded the
        // blur out at the borders, leaving a sharp rim where the untouched image showed through.
        if (opts.blurAmount > 0) {
            ctx.filter = `blur(${opts.blurAmount}px)`;
            drawBackgroundImage(ctx, image, opts, Math.ceil(opts.blurAmount * BLUR_OVERSCAN));
            ctx.filter = 'none';
        }

        // Add semi-transparent overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(0, 0, width, height);
    } else {
        ctx.fillStyle = FALLBACK_BACKGROUND;
        ctx.fillRect(0, 0, width, height);
    }

    drawText(ctx, opts);
};

const setFont = (ctx: BannerContext2D, fontSize: number, fontFamily: string) => {
    ctx.font = `bold ${fontSize}px ${fontFamily}`;
};

/** A piece of text, plus whether it continues the previous piece without a space. */
interface TextToken {
    text: string;
    continuesWord: boolean;
}

/** Splits a word that is wider than a whole line into chunks that each fit. */
const splitLongWord = (ctx: BannerContext2D, word: string, maxWidth: number): string[] => {
    const parts: string[] = [];
    let current = '';

    // Walk code points, so surrogate pairs (emoji, some scripts) are never cut in half.
    for (const char of word) {
        const candidate = current + char;
        if (current && ctx.measureText(candidate).width > maxWidth) {
            parts.push(current);
            current = char;
        } else {
            current = candidate;
        }
    }
    if (current) parts.push(current);

    return parts;
};

const tokenize = (ctx: BannerContext2D, paragraph: string, maxWidth: number): TextToken[] => {
    const tokens: TextToken[] = [];

    for (const word of paragraph.split(' ')) {
        if (!word) {
            // Keep the empty token so runs of spaces survive wrapping.
            tokens.push({ text: '', continuesWord: false });
            continue;
        }
        if (ctx.measureText(word).width <= maxWidth) {
            tokens.push({ text: word, continuesWord: false });
            continue;
        }
        splitLongWord(ctx, word, maxWidth).forEach((part, index) => {
            tokens.push({ text: part, continuesWord: index > 0 });
        });
    }

    return tokens;
};

const wrapParagraph = (ctx: BannerContext2D, paragraph: string, maxWidth: number): string[] => {
    const lines: string[] = [];
    let currentLine = '';

    for (const token of tokenize(ctx, paragraph, maxWidth)) {
        // Chunks of a split word are joined without a space; whole words get one.
        const candidate =
            token.continuesWord || !currentLine ? currentLine + token.text : `${currentLine} ${token.text}`;

        if (currentLine && ctx.measureText(candidate).width > maxWidth) {
            lines.push(currentLine);
            currentLine = token.text;
        } else {
            currentLine = candidate;
        }
    }

    if (currentLine) lines.push(currentLine);

    return lines;
};

export const wrapText = (ctx: BannerContext2D, text: string, maxWidth: number): string[] => {
    const lines: string[] = [];

    // First split by manual line breaks
    for (const paragraph of text.split(/\r?\n/)) {
        if (!paragraph.trim()) {
            // Preserve empty lines
            lines.push('');
            continue;
        }
        lines.push(...wrapParagraph(ctx, paragraph, maxWidth));
    }

    return lines;
};

/**
 * Wraps the text and shrinks the font size until the block fits inside the canvas, so long
 * text is never drawn off the top or bottom edge. Wrapping is redone at every smaller size,
 * because narrower glyphs re-flow the text onto fewer lines.
 */
export const layoutText = (ctx: BannerContext2D, opts: RenderOptions): TextLayout => {
    const maxWidth = opts.width * TEXT_WIDTH_RATIO;
    const maxHeight = opts.height * TEXT_HEIGHT_RATIO;

    let fontSize = opts.fontSize;
    let lines: string[] = [];
    let lineHeight = fontSize * LINE_HEIGHT_RATIO;

    for (;;) {
        setFont(ctx, fontSize, opts.fontFamily);
        lines = wrapText(ctx, opts.text, maxWidth);
        lineHeight = fontSize * LINE_HEIGHT_RATIO;

        const textHeight = lines.length * lineHeight;
        if (textHeight <= maxHeight || fontSize <= MIN_FONT_SIZE) break;

        // Jump straight to the size that would fit, rounded down, then re-check with the new
        // wrapping. Every pass shrinks the font strictly, so the loop always terminates.
        const next = Math.max(MIN_FONT_SIZE, Math.floor(fontSize * (maxHeight / textHeight)));
        if (next >= fontSize) break;
        fontSize = next;
    }

    return { lines, fontSize, lineHeight };
};

const drawText = (ctx: BannerContext2D, opts: RenderOptions) => {
    const { fontColor, textStrokeColor, width, height } = opts;

    const { lines, fontSize, lineHeight } = layoutText(ctx, opts);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Draw text with custom colors; the outline scales with the text so small text keeps its
    // counters open and large text keeps a visible outline. Round joins avoid miter spikes.
    ctx.strokeStyle = textStrokeColor;
    ctx.lineWidth = strokeWidth(fontSize);
    ctx.lineJoin = LINE_JOIN;
    ctx.miterLimit = MITER_LIMIT;
    ctx.fillStyle = fontColor;

    // Centre the block vertically; layoutText guarantees the block fits
    const totalTextHeight = lines.length * lineHeight;
    const startY = (height - totalTextHeight) / 2 + lineHeight / 2;

    // Draw each line
    const x = width / 2;
    lines.forEach((line, index) => {
        const y = startY + index * lineHeight;
        ctx.strokeText(line, x, y);
        ctx.fillText(line, x, y);
    });
};
