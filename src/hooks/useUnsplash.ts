import { useState } from 'react';
import type { Image } from '../types';

const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY || 'YOUR_UNSPLASH_ACCESS_KEY';

export const useUnsplash = () => {
    const [images, setImages] = useState<Image[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const searchImages = async (query: string) => {
        if (!query.trim()) {
            setImages([]);
            return;
        }
        
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=12&client_id=${ACCESS_KEY}`
            );
            
            if (!response.ok) {
                throw new Error('Failed to fetch images');
            }
            
            const data = await response.json();
            setImages(data.results || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            setImages([]);
        } finally {
            setLoading(false);
        }
    };

    return { images, loading, error, searchImages };
};