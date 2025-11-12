import { useEffect, useRef, useState } from 'react';

const useBannerCanvas = (initialText: string, initialFont: string, backgroundImage: string) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [text, setText] = useState(initialText);
    const [font, setFont] = useState(initialFont);
    const [image, setImage] = useState(backgroundImage);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                // Set canvas dimensions
                canvas.width = 800; // Example width
                canvas.height = 450; // Example height for 16:9 aspect ratio

                // Draw background image
                const img = new Image();
                img.src = image;
                img.onload = () => {
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    drawText(ctx);
                };
            }
        }
    }, [text, font, image]);

    const drawText = (ctx: CanvasRenderingContext2D) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clear canvas
        const textWidth = ctx.measureText(text).width;
        const x = (ctx.canvas.width - textWidth) / 2; // Center text horizontally
        const y = ctx.canvas.height / 2; // Center text vertically

        ctx.font = font;
        ctx.fillStyle = 'white'; // Example text color
        ctx.textAlign = 'center';
        ctx.fillText(text, x + textWidth / 2, y);
    };

    const updateText = (newText: string) => {
        setText(newText);
    };

    const updateFont = (newFont: string) => {
        setFont(newFont);
    };

    const updateBackgroundImage = (newImage: string) => {
        setImage(newImage);
    };

    return {
        canvasRef,
        text,
        font,
        updateText,
        updateFont,
        updateBackgroundImage,
    };
};

export default useBannerCanvas;