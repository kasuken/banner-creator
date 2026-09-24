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

const FALLBACK_BACKGROUND = '#f3f4f6';

/**
 * Draws the full banner. Pass `image = null` when there is no background image
 * or it failed to load; a gray background is drawn instead.
 * The caller is responsible for sizing the canvas to `opts.width` x `opts.height`.
 */
export const renderBanner = (ctx: BannerContext2D, image: BannerImage | null, opts: RenderOptions): void => {
    const { width, height } = opts;

    ctx.clearRect(0, 0, width, height);

    if (image) {
        // Draw image based on fit mode
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
            ctx.drawImage(image, sx, sy, sw, sh, 0, 0, width, height);
        } else {
            ctx.drawImage(image, 0, 0, width, height);
        }

        // Apply blur effect by redrawing the canvas onto itself
        if (opts.blurAmount > 0) {
            ctx.filter = `blur(${opts.blurAmount}px)`;
            ctx.drawImage(ctx.canvas, 0, 0);
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

export const wrapText = (ctx: BannerContext2D, text: string, maxWidth: number): string[] => {
    // First split by manual line breaks
    const paragraphs = text.split(/\r?\n/);
    const lines: string[] = [];

    // Then wrap each paragraph if needed
    for (const paragraph of paragraphs) {
        if (!paragraph.trim()) {
            // Preserve empty lines
            lines.push('');
            continue;
        }

        const words = paragraph.split(' ');
        let currentLine = '';

        for (const word of words) {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            const metrics = ctx.measureText(testLine);

            if (metrics.width > maxWidth && currentLine) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        }

        if (currentLine) {
            lines.push(currentLine);
        }
    }

    return lines;
};

const drawText = (ctx: BannerContext2D, opts: RenderOptions) => {
    const { text, fontFamily, fontSize, fontColor, textStrokeColor, width, height } = opts;

    ctx.font = `bold ${fontSize}px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Draw text with custom colors
    ctx.strokeStyle = textStrokeColor;
    ctx.lineWidth = 3;
    ctx.fillStyle = fontColor;

    // Wrap text with padding on sides
    const maxWidth = width * 0.9; // 90% of canvas width
    const lines = wrapText(ctx, text, maxWidth);

    // Calculate line height and starting position
    const lineHeight = fontSize * 1.3;
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
