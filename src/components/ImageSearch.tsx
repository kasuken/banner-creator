import React, { useState, useEffect } from 'react';
import { useUnsplash } from '../hooks/useUnsplash';

interface ImageSearchProps {
    setBackgroundImage: (url: string) => void;
}

const ImageSearch: React.FC<ImageSearchProps> = ({ setBackgroundImage }) => {
    const [query, setQuery] = useState('');
    const { images, loading, error, searchImages } = useUnsplash();

    useEffect(() => {
        const debounceSearch = setTimeout(() => {
            if (query) {
                searchImages(query);
            }
        }, 500);

        return () => clearTimeout(debounceSearch);
    }, [query]);

    return (
        <div className="w-full max-w-2xl mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">
                Search Background Images (Unsplash):
            </label>
            <input
                type="text"
                placeholder="Search for images... (e.g., 'nature', 'technology', 'abstract')"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            {loading && (
                <div className="text-center py-4 text-gray-600">Loading images...</div>
            )}
            
            {error && (
                <div className="text-center py-4 text-red-600">{error}</div>
            )}
            
            {images.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mt-4 max-h-64 overflow-y-auto">
                    {images.map((image) => (
                        <img
                            key={image.id}
                            src={image.urls.thumb}
                            alt={image.alt_description || 'Unsplash image'}
                            className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-75 transition-opacity border-2 border-transparent hover:border-blue-500"
                            onClick={() => setBackgroundImage(image.urls.regular)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageSearch;