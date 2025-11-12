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
        <div className="w-full max-w-2xl mb-4">
            <label className="block mb-3 text-sm font-medium text-gray-700">
                Image Format:
            </label>
            
            {/* Category Tabs */}
            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => handleCategoryChange('blog')}
                    className={`px-6 py-2 rounded-lg font-medium transition-all ${
                        selectedCategory === 'blog'
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    Blog
                </button>
                <button
                    onClick={() => handleCategoryChange('linkedin')}
                    className={`px-6 py-2 rounded-lg font-medium transition-all ${
                        selectedCategory === 'linkedin'
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    LinkedIn
                </button>
            </div>

            {/* Ratio Options */}
            <div className="grid grid-cols-2 gap-3">
                {ratioConfigs[selectedCategory].map((config) => (
                    <button
                        key={config.id}
                        onClick={() => setAspectRatio(config.id)}
                        className={`px-4 py-3 rounded-lg border-2 transition-all ${
                            aspectRatio === config.id
                                ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                        }`}
                    >
                        <div className="text-center">
                            <div className="font-semibold">{config.name}</div>
                            <div className="text-xs mt-1 opacity-75">
                                {config.dimensions.width} × {config.dimensions.height}px
                            </div>
                            <div className="text-xs opacity-75">{config.description}</div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default AspectRatioSelector;
