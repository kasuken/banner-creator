import { useCallback, useRef, useState } from 'react';
import type { UnsplashPhoto } from '../types';

// Image search goes through our own API so the Unsplash access key stays on the server.
const SEARCH_ENDPOINT = '/api/images/search';
const RESULTS_PER_PAGE = 12;

interface SearchResponse {
    results?: UnsplashPhoto[];
    error?: string;
}

export const useUnsplash = () => {
    const [images, setImages] = useState<UnsplashPhoto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const latestRequest = useRef(0);

    const search = useCallback(async (query: string) => {
        const trimmed = query.trim();
        const requestId = ++latestRequest.current;

        if (!trimmed) {
            setImages([]);
            setError(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `${SEARCH_ENDPOINT}?query=${encodeURIComponent(trimmed)}&per_page=${RESULTS_PER_PAGE}`
            );
            const data: SearchResponse | null = await response.json().catch(() => null);

            // A newer search started while this one was in flight; drop the stale result.
            if (requestId !== latestRequest.current) return;

            if (!response.ok) {
                throw new Error(data?.error ?? `Image search failed (HTTP ${response.status}).`);
            }
            setImages(Array.isArray(data?.results) ? data.results : []);
        } catch (err) {
            if (requestId !== latestRequest.current) return;
            setError(err instanceof Error ? err.message : 'Image search failed.');
            setImages([]);
        } finally {
            if (requestId === latestRequest.current) setLoading(false);
        }
    }, []);

    /**
     * Registers the photo as used with Unsplash, which their API guidelines require when a photo
     * is displayed. Returns the full-size URL the server resolved, if it could.
     */
    const trackPhotoUse = useCallback(async (id: string): Promise<string | null> => {
        try {
            const response = await fetch(`/api/images/photos/${encodeURIComponent(id)}`);
            if (!response.ok) return null;
            const data: { image_url?: string } = await response.json();
            return typeof data.image_url === 'string' ? data.image_url : null;
        } catch {
            return null;
        }
    }, []);

    return { images, loading, error, search, trackPhotoUse };
};
