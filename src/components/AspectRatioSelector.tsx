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
        // Set first option of the new category
        setAspectRatio(ratioConfigs[category][0].id);
    };

    return (
        <div className="w-full">
            <label className="block mb-3 text-sm font-medium text-gray-700">
                Platform & Size
            </label>
            
            {/* Category Tabs */}
            <div className="flex gap-2 mb-4" role="tablist" aria-label="Platform selection">
                <button
                    onClick={() => handleCategoryChange('blog')}
                    className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                        selectedCategory === 'blog'
                            ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    role="tab"
                    aria-selected={selectedCategory === 'blog'}
                    aria-controls="aspect-ratio-options"
                >
                    <div className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                        Blog
                    </div>
                </button>
                <button
                    onClick={() => handleCategoryChange('linkedin')}
                    className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                        selectedCategory === 'linkedin'
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    role="tab"
                    aria-selected={selectedCategory === 'linkedin'}
                    aria-controls="aspect-ratio-options"
                >
                    <div className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        LinkedIn
                    </div>
                </button>
            </div>

            {/* Ratio Options */}
            <div id="aspect-ratio-options" className="grid grid-cols-2 gap-3" role="tabpanel" aria-label="Aspect ratio options">
                {ratioConfigs[selectedCategory].map((config) => (
                    <button
                        key={config.id}
                        onClick={() => setAspectRatio(config.id)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                            aspectRatio === config.id
                                ? 'border-purple-500 bg-purple-50 shadow-md'
                                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                        }`}
                        aria-pressed={aspectRatio === config.id}
                        aria-label={`${config.name}, ${config.dimensions.width} by ${config.dimensions.height} pixels, ${config.description}`}
                    >
                        <div className="font-semibold text-gray-800 mb-1">{config.name}</div>
                        <div className="text-xs text-gray-600 mb-1">
                            {config.dimensions.width} × {config.dimensions.height}px
                        </div>
                        <div className="text-xs text-gray-500">{config.description}</div>
                        {aspectRatio === config.id && (
                            <div className="mt-2 flex items-center gap-1 text-purple-600 text-xs font-medium">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Selected
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default AspectRatioSelector;
