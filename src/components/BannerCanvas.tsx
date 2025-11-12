import React, { useRef, useEffect, forwardRef } from 'react';
import type { AspectRatio } from './AspectRatioSelector';

interface BannerCanvasProps {
    backgroundImage: string;
    text: string;
    fontFamily: string;
    fontSize: number;
    aspectRatio: AspectRatio;
    blurAmount: number;
}

const BannerCanvas = forwardRef<HTMLCanvasElement, BannerCanvasProps>(
    ({ backgroundImage, text, fontFamily, fontSize, aspectRatio, blurAmount }, ref) => {
        const internalRef = useRef<HTMLCanvasElement>(null);
        const canvasRef = (ref as React.RefObject<HTMLCanvasElement>) || internalRef;

        useEffect(() => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Set canvas dimensions based on aspect ratio
            const dimensionsMap: Record<AspectRatio, { width: number; height: number }> = {
                'blog-16:9': { width: 1600, height: 900 },
                'blog-1000:420': { width: 1000, height: 420 },
                'linkedin-square': { width: 1080, height: 1080 },
                'linkedin-landscape': { width: 1920, height: 1080 },
                'linkedin-article-featured': { width: 1200, height: 644 },
                'linkedin-article-banner': { width: 600, height: 322 },
                'linkedin-blog-link': { width: 1200, height: 627 },
            };
            
            const dimensions = dimensionsMap[aspectRatio];
            canvas.width = dimensions.width;
            canvas.height = dimensions.height;

            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (backgroundImage) {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.src = backgroundImage;

                img.onload = () => {
                    // Draw image to cover canvas
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    // Apply blur effect by drawing to a temporary canvas
                    ctx.filter = `blur(${blurAmount}px)`;
                    ctx.drawImage(canvas, 0, 0);
                    ctx.filter = 'none';

                    // Add semi-transparent overlay
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    // Draw text
                    drawText(ctx, text, fontFamily, fontSize, canvas.width, canvas.height);
                };

                img.onerror = () => {
                    // If image fails to load, just draw text on gray background
                    ctx.fillStyle = '#f3f4f6';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    drawText(ctx, text, fontFamily, fontSize, canvas.width, canvas.height);
                };
            } else {
                // No background image, use gray background
                ctx.fillStyle = '#f3f4f6';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                drawText(ctx, text, fontFamily, fontSize, canvas.width, canvas.height);
            }
        }, [backgroundImage, text, fontFamily, fontSize, aspectRatio, blurAmount]);

        const wrapText = (
            ctx: CanvasRenderingContext2D,
            text: string,
            maxWidth: number
        ): string[] => {
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

        const drawText = (
            ctx: CanvasRenderingContext2D,
            text: string,
            fontFamily: string,
            fontSize: number,
            width: number,
            height: number
        ) => {
            ctx.font = `bold ${fontSize}px ${fontFamily}`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Draw text with white fill and black stroke for better visibility
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.lineWidth = 3;
            ctx.fillStyle = 'white';

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

        return (
            <div className="w-full max-w-2xl mb-6">
                <canvas
                    ref={canvasRef}
                    className="w-full border-2 border-gray-300 rounded-lg shadow-lg"
                />
            </div>
        );
    }
);

BannerCanvas.displayName = 'BannerCanvas';

export default BannerCanvas;