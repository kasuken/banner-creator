import React, { useRef, useEffect, useState, forwardRef } from 'react';
import { getAspectRatio, type AspectRatio, type ImageFitMode } from '../../shared/presets';
import { layoutText, renderBanner } from '../../shared/renderBanner';

interface BannerCanvasProps {
    backgroundImage: string;
    text: string;
    fontFamily: string;
    fontSize: number;
    fontColor: string;
    textStrokeColor: string;
    aspectRatio: AspectRatio;
    blurAmount: number;
    imageFit: ImageFitMode;
    /** Called after every draw, including the one that completes an async image load. */
    onRendered?: () => void;
}

const BannerCanvas = forwardRef<HTMLCanvasElement, BannerCanvasProps>(
    ({ backgroundImage, text, fontFamily, fontSize, fontColor, textStrokeColor, aspectRatio, blurAmount, imageFit, onRendered }, ref) => {
        const internalRef = useRef<HTMLCanvasElement>(null);
        const canvasRef = (ref as React.RefObject<HTMLCanvasElement>) || internalRef;
        const { width: canvasWidth, height: canvasHeight } = getAspectRatio(aspectRatio);
        // Font size the text is actually drawn with when it has to shrink to fit, otherwise null.
        const [scaledTo, setScaledTo] = useState<number | null>(null);
        // Set when the background image can't be used, so the gray fallback isn't silent.
        const [imageFailed, setImageFailed] = useState(false);

        useEffect(() => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Set canvas dimensions based on aspect ratio
            const { width, height } = getAspectRatio(aspectRatio);
            canvas.width = width;
            canvas.height = height;

            const options = { width, height, text, fontFamily, fontSize, fontColor, textStrokeColor, blurAmount, imageFit };

            setImageFailed(false);

            // Surface the auto-shrink: the size drawn can be smaller than the one the sliders show.
            const fittedFontSize = layoutText(ctx, options).fontSize;
            setScaledTo(fittedFontSize < fontSize ? fittedFontSize : null);

            if (!backgroundImage) {
                renderBanner(ctx, null, options);
                onRendered?.();
                return;
            }

            let cancelled = false;
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                if (cancelled) return;
                renderBanner(ctx, img, options);
                onRendered?.();
            };
            img.onerror = () => {
                // If image fails to load, draw the text on a gray background and explain why.
                if (!cancelled) {
                    setImageFailed(true);
                    renderBanner(ctx, null, options);
                    onRendered?.();
                }
            };
            img.src = backgroundImage;

            return () => {
                cancelled = true;
            };
        }, [canvasRef, backgroundImage, text, fontFamily, fontSize, fontColor, textStrokeColor, aspectRatio, blurAmount, imageFit, onRendered]);

        return (
            <div className="w-full">
                <canvas
                    ref={canvasRef}
                    className="w-full rounded-sm"
                    aria-label={`Banner preview, ${canvasWidth} by ${canvasHeight} pixels${
                        text ? `, showing the text: ${text}` : ', no text'
                    }${scaledTo === null ? '' : `, text scaled from ${fontSize} to ${scaledTo} pixels to fit`}${
                        imageFailed ? ', background image could not be loaded' : ''
                    }`}
                    role="img"
                />
                {imageFailed && (
                    <p className="px-3 py-2 text-[11px] text-red-400 border-t border-surface-border" role="alert">
                        Background image couldn't be loaded, so this preview uses a plain background. The
                        site hosting it may not allow it to be drawn into a canvas.
                    </p>
                )}
                {scaledTo !== null && (
                    <p className="px-3 py-2 text-[11px] text-cream-muted border-t border-surface-border">
                        Scaled to <span className="font-mono text-copper">{scaledTo}px</span> to fit the canvas
                        {' '}(selected: {fontSize}px)
                    </p>
                )}
            </div>
        );
    }
);

BannerCanvas.displayName = 'BannerCanvas';

export default BannerCanvas;
