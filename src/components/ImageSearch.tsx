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
            <label className="block mb-2 text-sm font-medium text-gray-700">
                Background Image
            </label>
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search images... (e.g., 'nature', 'workspace', 'abstract')"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl p-3 pl-11 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            
            {loading && (
                <div className="flex items-center justify-center py-8 text-cyan-600">
                    <svg className="animate-spin h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="font-medium">Searching images...</span>
                </div>
            )}
            
            {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                </div>
            )}
            
            {images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-3 max-h-80 overflow-y-auto p-1 rounded-lg">
                    {images.map((image) => (
                        <button
                            key={image.id}
                            onClick={() => handleImageSelect(image.id, image.urls.regular)}
                            className={`relative group overflow-hidden rounded-lg transition-all ${
                                selectedImageId === image.id
                                    ? 'ring-4 ring-cyan-500 ring-offset-2'
                                    : 'hover:ring-2 hover:ring-cyan-300'
                            }`}
                        >
                            <img
                                src={image.urls.thumb}
                                alt={image.alt_description || 'Unsplash image'}
                                className="w-full h-24 object-cover transition-transform group-hover:scale-110"
                            />
                            {selectedImageId === image.id && (
                                <div className="absolute inset-0 bg-cyan-500/20 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            )}
            
            {!loading && query && images.length === 0 && (
                <div className="mt-4 text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm">No images found. Try a different search term.</p>
                </div>
            )}
        </div>
    );
};

export default ImageSearch;