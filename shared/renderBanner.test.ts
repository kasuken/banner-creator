import { describe, expect, it } from 'vitest';
import {
    layoutText,
    MIN_FONT_SIZE,
    renderBanner,
    wrapText,
    type BannerContext2D,
    type RenderOptions,
} from './renderBanner';

// Stand-in for a canvas context: every character measures 10px wide, whatever the font size.
const createContext = (): BannerContext2D =>
    ({ measureText: (text: string) => ({ width: text.length * 10 }) } as unknown as BannerContext2D);

const baseOptions = (overrides: Partial<RenderOptions> = {}): RenderOptions => ({
    width: 600,
    height: 322,
    text: 'Create Beautiful Banners',
    fontFamily: 'Arial, sans-serif',
    fontSize: 160,
    fontColor: '#ffffff',
    textStrokeColor: '#000000',
    blurAmount: 0,
    imageFit: 'cover',
    ...overrides,
});

describe('wrapText', () => {
    it('keeps text on one line when it fits', () => {
        expect(wrapText(createContext(), 'Hello world', 1000)).toEqual(['Hello world']);
    });

    it('wraps once the line would exceed the maximum width', () => {
        // "one two" is 70px, "one two three" would be 130px
        expect(wrapText(createContext(), 'one two three', 100)).toEqual(['one two', 'three']);
    });

    it('splits on manual line breaks', () => {
        expect(wrapText(createContext(), 'first\nsecond', 1000)).toEqual(['first', 'second']);
    });

    it('preserves blank lines', () => {
        expect(wrapText(createContext(), 'first\n\nsecond', 1000)).toEqual(['first', '', 'second']);
    });

    it('returns a single empty line for empty text', () => {
        expect(wrapText(createContext(), '', 1000)).toEqual(['']);
    });
});

describe('wrapText with unbreakable words', () => {
    it('splits a word that is wider than the whole line', () => {
        // 30 characters at 10px each: three chunks of 100px, one per line
        expect(wrapText(createContext(), `a ${'x'.repeat(30)}`, 100)).toEqual([
            'a',
            'x'.repeat(10),
            'x'.repeat(10),
            'x'.repeat(10),
        ]);
    });

    it('breaks a long word when it is the whole text', () => {
        expect(wrapText(createContext(), 'z'.repeat(25), 100)).toEqual([
            'z'.repeat(10),
            'z'.repeat(10),
            'z'.repeat(5),
        ]);
    });

    it('never emits a line wider than the maximum', () => {
        const ctx = createContext();
        const lines = wrapText(ctx, `short ${'y'.repeat(45)} tail`, 100);

        expect(lines.length).toBeGreaterThan(1);
        for (const line of lines) {
            expect(ctx.measureText(line).width).toBeLessThanOrEqual(100);
        }
    });
});

interface RecordedDraw {
    image: unknown;
    args: number[];
}

/** Context that records draw calls, for the parts of renderBanner that touch the canvas. */
const createRecordingContext = () => {
    const draws: RecordedDraw[] = [];
    const state = {
        canvas: { name: 'canvas' },
        font: '',
        textAlign: 'start',
        textBaseline: 'alphabetic',
        strokeStyle: '#000000' as unknown,
        fillStyle: '#000000' as unknown,
        lineWidth: 1,
        lineJoin: 'miter',
        miterLimit: 10,
        filter: 'none',
        measureText: (text: string) => ({ width: text.length * 10 }),
        clearRect: () => undefined,
        fillRect: () => undefined,
        strokeText: () => undefined,
        fillText: () => undefined,
        drawImage: (image: unknown, ...args: number[]) => {
            draws.push({ image, args });
        },
    };
    return { ctx: state as unknown as BannerContext2D, state, draws };
};

const image = { width: 2000, height: 1000 };

describe('renderBanner', () => {
    it('scales the text outline with the font size', () => {
        const small = createRecordingContext();
        renderBanner(small.ctx, null, baseOptions({ width: 1600, height: 900, text: 'Hi', fontSize: 32 }));

        expect(small.state.lineWidth).toBe(2);
        expect(small.state.lineJoin).toBe('round');

        const large = createRecordingContext();
        renderBanner(large.ctx, null, baseOptions({ width: 1600, height: 900, text: 'Hi', fontSize: 160 }));

        expect(large.state.lineWidth).toBe(10);
    });

    it('never draws an outline thinner than a hairline', () => {
        const { ctx, state } = createRecordingContext();
        renderBanner(ctx, null, baseOptions({ width: 1600, height: 900, text: 'Hi', fontSize: 12 }));

        expect(state.lineWidth).toBe(1);
    });

    it('blurs the image drawn past the canvas edges instead of the canvas itself', () => {
        const { ctx, state, draws } = createRecordingContext();
        renderBanner(ctx, image, baseOptions({ width: 1000, height: 500, blurAmount: 10 }));

        // A sharp pass, then a blurred copy.
        expect(draws).toHaveLength(2);
        expect(draws[0].args.slice(4)).toEqual([0, 0, 1000, 500]);

        const [dx, dy, dw, dh] = draws[1].args.slice(4);
        expect(dx).toBeLessThan(0);
        expect(dy).toBeLessThan(0);
        expect(dw).toBeGreaterThan(1000);
        expect(dh).toBeGreaterThan(500);

        // Drawing the canvas onto itself was what pulled transparency into the edges.
        expect(draws.some((draw) => draw.image === state.canvas)).toBe(false);
        expect(state.filter).toBe('none');
    });

    it('draws the image once when no blur is requested', () => {
        const { ctx, draws } = createRecordingContext();
        renderBanner(ctx, image, baseOptions({ width: 1000, height: 500 }));

        expect(draws).toHaveLength(1);
    });
});

describe('layoutText', () => {
    it('keeps the requested size when the text already fits', () => {
        const layout = layoutText(
            createContext(),
            baseOptions({ width: 1600, height: 900, fontSize: 72, text: 'Short banner' })
        );

        expect(layout.fontSize).toBe(72);
        expect(layout.lines).toEqual(['Short banner']);
        expect(layout.lineHeight).toBeCloseTo(72 * 1.3);
    });

    it('shrinks oversized text until the block fits the canvas height', () => {
        const ctx = createContext();

        // 250 characters at 160px cannot fit a 600x322 banner.
        const layout = layoutText(ctx, baseOptions({ text: 'word '.repeat(50) }));

        expect(layout.fontSize).toBeLessThan(160);
        expect(layout.lines.length * layout.lineHeight).toBeLessThanOrEqual(322 * 0.9);
        expect(ctx.font).toBe(`bold ${layout.fontSize}px Arial, sans-serif`);
    });

    it('stops shrinking at the minimum font size', () => {
        // Far more text than could ever fit: the floor wins instead of shrinking forever.
        const layout = layoutText(createContext(), baseOptions({ text: 'a'.repeat(1100) }));

        expect(layout.fontSize).toBe(MIN_FONT_SIZE);
        expect(layout.lines.length).toBeGreaterThan(1);
    });

    it('never grows text above the requested size', () => {
        const layout = layoutText(createContext(), baseOptions({ width: 1600, height: 900, fontSize: 32 }));

        expect(layout.fontSize).toBe(32);
    });
});
