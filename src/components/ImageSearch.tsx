import React, { useState, useEffect } from 'react';
import { useUnsplash } from '../hooks/useUnsplash';

interface ImageSearchProps {
    setBackgroundImage: (url: string) => void;
}

const ImageSearch: React.FC<ImageSearchProps> = ({ setBackgroundImage }) => {
    const [query, setQuery] = useState('');
    const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
    const { images, loading, error, searchImages } = useUnsplash();

    useEffect(() => {
        const debounceSearch = setTimeout(() => {
            if (query) {
                searchImages(query);
            }
        }, 500);

        return () => clearTimeout(debounceSearch);
    }, [query]);

    const handleImageSelect = (imageId: string, imageUrl: string) => {
        setSelectedImageId(imageId);
        setBackgroundImage(imageUrl);
    };

    return (
        <div className="w-full">
            <label htmlFor="image-search" className="block mb-2 text-xs font-medium text-cream-dim tracking-wide">
                Search Images
            </label>
            <div className="relative">
                <input
                    id="image-search"
                    type="text"
                    placeholder="nature, workspace, abstract..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-surface-overlay border border-surface-border rounded-md p-2.5 pl-9 text-cream text-sm placeholder:text-cream-muted/40 focus:border-copper focus:ring-1 focus:ring-copper/30 transition-colors font-body"
                    aria-label="Search for background images"
                    aria-describedby="image-search-status"
                />
                <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-muted/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>

            <div id="image-search-status" role="status" aria-live="polite" aria-atomic="true">
                {loading && (
                    <div className="flex items-center justify-center py-6 text-cream-muted">
                        <svg className="animate-spin h-4 w-4 mr-2 text-copper" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-xs">Searching...</span>
                    </div>
                )}
            
                {error && (
                    <div className="mt-3 p-3 bg-red-900/20 border border-red-800/30 rounded-md text-red-400 text-xs" role="alert">
                        {error}
                    </div>
                )}
            </div>
            
            {images.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-1.5 max-h-56 overflow-y-auto studio-scroll rounded-md" role="list" aria-label="Search results">
                    {images.map((image) => (
                        <button
                            key={image.id}
                            onClick={() => handleImageSelect(image.id, image.urls.regular)}
                            className={`relative group overflow-hidden rounded-sm transition-all ${
                                selectedImageId === image.id
                                    ? 'ring-2 ring-copper ring-offset-1 ring-offset-surface'
                                    : 'hover:ring-1 hover:ring-cream-muted/20'
                            }`}
                            aria-label={`Select image: ${image.alt_description || 'Unsplash image'}`}
                            aria-pressed={selectedImageId === image.id}
                            role="listitem"
                        >
                            <img
                                src={image.urls.thumb}
                                alt={image.alt_description || 'Unsplash image'}
                                className="w-full h-20 object-cover transition-transform group-hover:scale-105"
                            />
                            {selectedImageId === image.id && (
                                <div className="absolute inset-0 bg-copper/20 flex items-center justify-center">
                                    <div className="w-5 h-5 rounded-full bg-copper flex items-center justify-center">
                                        <svg className="w-3 h-3 text-surface" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            )}
            
            {!loading && query && images.length === 0 && (
                <div className="mt-3 text-center py-6 text-cream-muted/50" role="status">
                    <p className="text-xs">No results. Try another term.</p>
                </div>
            )}
        </div>
    );
};

export default ImageSearch;