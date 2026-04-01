import { useState } from 'react';
import type { Image } from '../types';

const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY?.trim();
const HAS_VALID_ACCESS_KEY = Boolean(
    ACCESS_KEY &&
    ACCESS_KEY !== 'YOUR_UNSPLASH_ACCESS_KEY' &&
    ACCESS_KEY !== 'your_unsplash_access_key_here'
);

export const useUnsplash = () => {
    const [images, setImages] = useState<Image[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const searchImages = async (query: string) => {
        if (!query.trim()) {
            setImages([]);
            return;
        }

        if (!HAS_VALID_ACCESS_KEY) {
            setError('Unsplash API key is not configured. Set VITE_UNSPLASH_ACCESS_KEY and redeploy.');
            setImages([]);
            return;
        }
        
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=12`,
                {
                    headers: {
                        Authorization: `Client-ID ${ACCESS_KEY}`,
                        'Accept-Version': 'v1',
                    },
                }
            );
            
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Unsplash authentication failed. Check VITE_UNSPLASH_ACCESS_KEY in production.');
                }

                throw new Error(`Failed to fetch images (status ${response.status})`);
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

    return { images, loading, error, searchImages, isConfigured: HAS_VALID_ACCESS_KEY };
};