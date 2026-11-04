import { describe, expect, it } from 'vitest';
import { DEFAULT_SETTINGS, MAX_TEXT_LENGTH, settingsFromSearchParams } from './presets';

const parse = (query: string) => settingsFromSearchParams(new URLSearchParams(query));

describe('settingsFromSearchParams', () => {
    it('returns the defaults when there are no parameters', () => {
        expect(parse('')).toEqual(DEFAULT_SETTINGS);
    });

    it('reads every supported key', () => {
        const settings = parse(
            'text=Hello' +
                '&font=Impact' +
                '&size=96' +
                '&color=%23ff0000' +
                '&stroke=%2300ff00' +
                '&format=linkedin-square' +
                '&blur=4' +
                '&fit=stretch' +
                '&image=https%3A%2F%2Fexample.com%2Fbg.jpg'
        );

        expect(settings).toEqual({
            text: 'Hello',
            fontFamily: 'Impact, sans-serif',
            fontSize: 96,
            fontColor: '#ff0000',
            textStrokeColor: '#00ff00',
            aspectRatio: 'linkedin-square',
            blurAmount: 4,
            imageFit: 'stretch',
            backgroundImage: 'https://example.com/bg.jpg',
        });
    });

    it('matches fonts case-insensitively by family name', () => {
        expect(parse('font=georgia').fontFamily).toBe('Georgia, serif');
    });

    it('clamps the font size and blur to their ranges', () => {
        expect(parse('size=999&blur=-10')).toMatchObject({ fontSize: 160, blurAmount: 0 });
    });

    it('ignores values that are not valid', () => {
        const settings = parse(
            'size=abc&color=red&stroke=%23fff&format=square&fit=crop&image=http%3A%2F%2Fexample.com%2Fa.jpg'
        );

        expect(settings).toEqual(DEFAULT_SETTINGS);
    });

    it('truncates text to the maximum length', () => {
        const settings = parse(`text=${'a'.repeat(MAX_TEXT_LENGTH + 50)}`);

        expect(settings.text).toHaveLength(MAX_TEXT_LENGTH);
    });

    it('accepts an empty image to fall back to a plain background', () => {
        expect(parse('image=').backgroundImage).toBe('');
    });
});
