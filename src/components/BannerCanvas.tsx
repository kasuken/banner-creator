import React, { useRef, useEffect, forwardRef } from 'react';
import { getAspectRatio, type AspectRatio, type ImageFitMode } from '../../shared/presets';
import { renderBanner } from '../../shared/renderBanner';

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
}

const BannerCanvas = forwardRef<HTMLCanvasElement, BannerCanvasProps>(
    ({ backgroundImage, text, fontFamily, fontSize, fontColor, textStrokeColor, aspectRatio, blurAmount, imageFit }, ref) => {
        const internalRef = useRef<HTMLCanvasElement>(null);
        const canvasRef = (ref as React.RefObject<HTMLCanvasElement>) || internalRef;

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

            if (!backgroundImage) {
                renderBanner(ctx, null, options);
                return;
            }

            let cancelled = false;
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                if (!cancelled) renderBanner(ctx, img, options);
            };
            img.onerror = () => {
                // If image fails to load, just draw text on gray background
                if (!cancelled) renderBanner(ctx, null, options);
            };
            img.src = backgroundImage;

            return () => {
                cancelled = true;
            };
        }, [backgroundImage, text, fontFamily, fontSize, fontColor, textStrokeColor, aspectRatio, blurAmount, imageFit]);

        return (
            <div className="w-full">
                <canvas
                    ref={canvasRef}
                    className="w-full rounded-sm"
                    aria-label="Banner preview canvas"
                    role="img"
                />
            </div>
        );
    }
);

BannerCanvas.displayName = 'BannerCanvas';

export default BannerCanvas;
