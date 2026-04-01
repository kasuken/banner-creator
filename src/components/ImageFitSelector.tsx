import React from 'react';
import type { ImageFitMode } from '../types';

interface ImageFitSelectorProps {
    imageFit: ImageFitMode;
    setImageFit: (fit: ImageFitMode) => void;
}

const options: { id: ImageFitMode; label: string; description: string }[] = [
    { id: 'cover', label: 'Cover', description: 'Crop to fill, keep ratio' },
    { id: 'stretch', label: 'Stretch', description: 'Fill canvas, may distort' },
];

const ImageFitSelector: React.FC<ImageFitSelectorProps> = ({ imageFit, setImageFit }) => {
    return (
        <div className="w-full">
            <label className="block mb-2 text-xs font-medium text-cream-dim tracking-wide">
                Image Fit
            </label>
            <div className="flex gap-1 p-0.5 bg-surface-overlay rounded-md border border-surface-border" role="radiogroup" aria-label="Image fit mode">
                {options.map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => setImageFit(opt.id)}
                        className={`flex-1 px-4 py-2 rounded text-xs font-medium transition-all ${
                            imageFit === opt.id
                                ? 'bg-copper text-surface'
                                : 'text-cream-muted hover:text-cream'
                        }`}
                        role="radio"
                        aria-checked={imageFit === opt.id}
                        aria-label={`${opt.label} — ${opt.description}`}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ImageFitSelector;
