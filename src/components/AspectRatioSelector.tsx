import React, { useState } from 'react';
import { ASPECT_RATIOS, getAspectRatio, type AspectRatio, type AspectRatioCategory } from '../../shared/presets';

export type { AspectRatio };

const ratiosByCategory = (category: AspectRatioCategory) => ASPECT_RATIOS.filter((r) => r.category === category);

interface AspectRatioSelectorProps {
    aspectRatio: AspectRatio;
    setAspectRatio: (ratio: AspectRatio) => void;
}

const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ aspectRatio, setAspectRatio }) => {
    const [selectedCategory, setSelectedCategory] = useState<AspectRatioCategory>(() => getAspectRatio(aspectRatio).category);

    const handleCategoryChange = (category: AspectRatioCategory) => {
        setSelectedCategory(category);
        setAspectRatio(ratiosByCategory(category)[0].id);
    };

    return (
        <div className="w-full">
            <label className="block mb-2 text-xs font-medium text-cream-dim tracking-wide">
                Platform & Size
            </label>
            
            {/* Category Tabs */}
            <div className="flex gap-1 mb-3 p-0.5 bg-surface-overlay rounded-md border border-surface-border" role="tablist" aria-label="Platform selection">
                <button
                    onClick={() => handleCategoryChange('blog')}
                    className={`flex-1 px-4 py-2 rounded text-xs font-medium transition-all ${
                        selectedCategory === 'blog'
                            ? 'bg-copper text-surface'
                            : 'text-cream-muted hover:text-cream'
                    }`}
                    role="tab"
                    aria-selected={selectedCategory === 'blog'}
                    aria-controls="aspect-ratio-options"
                >
                    Blog
                </button>
                <button
                    onClick={() => handleCategoryChange('linkedin')}
                    className={`flex-1 px-4 py-2 rounded text-xs font-medium transition-all ${
                        selectedCategory === 'linkedin'
                            ? 'bg-copper text-surface'
                            : 'text-cream-muted hover:text-cream'
                    }`}
                    role="tab"
                    aria-selected={selectedCategory === 'linkedin'}
                    aria-controls="aspect-ratio-options"
                >
                    LinkedIn
                </button>
            </div>

            {/* Ratio Options */}
            <div id="aspect-ratio-options" className="grid grid-cols-2 gap-2" role="tabpanel" aria-label="Aspect ratio options">
                {ratiosByCategory(selectedCategory).map((config) => (
                    <button
                        key={config.id}
                        onClick={() => setAspectRatio(config.id)}
                        className={`p-3 rounded-md border text-left transition-all ${
                            aspectRatio === config.id
                                ? 'border-copper bg-copper/10'
                                : 'border-surface-border bg-surface-overlay hover:border-cream-muted/20'
                        }`}
                        aria-pressed={aspectRatio === config.id}
                        aria-label={`${config.name}, ${config.width} by ${config.height} pixels, ${config.description}`}
                    >
                        <div className={`text-xs font-medium mb-0.5 ${aspectRatio === config.id ? 'text-copper' : 'text-cream'}`}>
                            {config.name}
                        </div>
                        <div className="text-[10px] text-cream-muted font-mono">
                            {config.width}×{config.height}
                        </div>
                        <div className="text-[10px] text-cream-muted/50 mt-0.5">{config.description}</div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default AspectRatioSelector;
