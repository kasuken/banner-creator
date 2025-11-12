import { ImageData } from '../types';

export const applyBlurEffect = (imageData: ImageData, blurAmount: number): ImageData => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('Failed to get canvas context');
    }

    canvas.width = imageData.width;
    canvas.height = imageData.height;
    ctx.putImageData(imageData, 0, 0);

    ctx.filter = `blur(${blurAmount}px)`;
    ctx.drawImage(canvas, 0, 0);

    return ctx.getImageData(0, 0, canvas.width, canvas.height);
};

export const resizeImage = (image: HTMLImageElement, maxWidth: number, maxHeight: number): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('Failed to get canvas context');
    }

    const ratio = Math.min(maxWidth / image.width, maxHeight / image.height);
    canvas.width = image.width * ratio;
    canvas.height = image.height * ratio;

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas;
};