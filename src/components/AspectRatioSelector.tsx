import React, { useState } from 'react';

export type AspectRatio = 
    | 'blog-16:9' 
    | 'blog-1000:420'
    | 'linkedin-square'
    | 'linkedin-landscape'
    | 'linkedin-article-featured'
    | 'linkedin-article-banner'
    | 'linkedin-blog-link';

type Category = 'blog' | 'linkedin';

interface AspectRatioConfig {
    id: AspectRatio;
    name: string;
    dimensions: { width: number; height: number };
    description: string;
}

const ratioConfigs: Record<Category, AspectRatioConfig[]> = {
    blog: [
        { 
            id: 'blog-16:9', 
            name: '16:9', 
            dimensions: { width: 1600, height: 900 }, 
            description: 'Standard Blog' 
        },
        { 
            id: 'blog-1000:420', 
            name: '1000:420', 
            dimensions: { width: 1000, height: 420 }, 
            description: 'dev.to Banner' 
        },
    ],
    linkedin: [
        { 
            id: 'linkedin-square', 
            name: 'Square Post', 
            dimensions: { width: 1080, height: 1080 }, 
            description: 'Single/Multi-Image' 
        },
        { 
            id: 'linkedin-landscape', 
            name: 'Landscape Post', 
            dimensions: { width: 1920, height: 1080 }, 
            description: 'Single/Multi-Image' 
        },
        { 
            id: 'linkedin-article-featured', 
            name: 'Article Featured', 
            dimensions: { width: 1200, height: 644 }, 
            description: 'Article Header' 
        },
        { 
            id: 'linkedin-article-banner', 
            name: 'Article Banner', 
            dimensions: { width: 600, height: 322 }, 
            description: 'Compact Banner' 
        },
        { 
            id: 'linkedin-blog-link', 
            name: 'Blog Link', 
            dimensions: { width: 1200, height: 627 }, 
            description: 'Shared Links' 
        },
    ],
};

interface AspectRatioSelectorProps {
    aspectRatio: AspectRatio;
    setAspectRatio: (ratio: AspectRatio) => void;
}

const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ aspectRatio, setAspectRatio }) => {
    const [selectedCategory, setSelectedCategory] = useState<Category>('blog');

    const handleCategoryChange = (category: Category) => {
        setSelectedCategory(category);
        setAspectRatio(ratioConfigs[category][0].id);
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
                {ratioConfigs[selectedCategory].map((config) => (
                    <button
                        key={config.id}
                        onClick={() => setAspectRatio(config.id)}
                        className={`p-3 rounded-md border text-left transition-all ${
                            aspectRatio === config.id
                                ? 'border-copper bg-copper/10'
                                : 'border-surface-border bg-surface-overlay hover:border-cream-muted/20'
                        }`}
                        aria-pressed={aspectRatio === config.id}
                        aria-label={`${config.name}, ${config.dimensions.width} by ${config.dimensions.height} pixels, ${config.description}`}
                    >
                        <div className={`text-xs font-medium mb-0.5 ${aspectRatio === config.id ? 'text-copper' : 'text-cream'}`}>
                            {config.name}
                        </div>
                        <div className="text-[10px] text-cream-muted font-mono">
                            {config.dimensions.width}×{config.dimensions.height}
                        </div>
                        <div className="text-[10px] text-cream-muted/50 mt-0.5">{config.description}</div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default AspectRatioSelector;
