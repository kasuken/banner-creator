import { UserFacingError } from './render';

const API_BASE = 'https://api.unsplash.com';
const UTM = 'utm_source=banner_creator&utm_medium=referral';

interface UnsplashPhoto {
    id: string;
    description: string | null;
    alt_description: string | null;
    width: number;
    height: number;
    urls: { raw: string; full: string; regular: string; small: string; thumb: string };
    links: { html: string; download_location: string };
    user: { name: string; username: string; links: { html: string } };
}

export interface PhotoSummary {
    id: string;
    description: string;
    width: number;
    height: number;
    image_url: string;
    thumbnail_url: string;
    photographer: string;
    photographer_url: string;
    unsplash_url: string;
}

const getAccessKey = (): string => {
    const key = process.env.UNSPLASH_ACCESS_KEY?.trim();
    if (!key) throw new UserFacingError('Unsplash search is not configured on this server (UNSPLASH_ACCESS_KEY missing).');
    return key;
};

const unsplashFetch = async <T>(pathAndQuery: string): Promise<T> => {
    const response = await fetch(`${API_BASE}${pathAndQuery}`, {
        headers: { Authorization: `Client-ID ${getAccessKey()}`, 'Accept-Version': 'v1' },
        signal: AbortSignal.timeout(10_000),
    });
    if (response.status === 404) throw new UserFacingError('Unsplash photo not found.');
    if (response.status === 403) throw new UserFacingError('Unsplash rate limit reached, try again later.');
    if (!response.ok) throw new UserFacingError(`Unsplash request failed (HTTP ${response.status}).`);
    return (await response.json()) as T;
};

export const summarizePhoto = (photo: UnsplashPhoto): PhotoSummary => ({
    id: photo.id,
    description: photo.description ?? photo.alt_description ?? '',
    width: photo.width,
    height: photo.height,
    image_url: photo.urls.regular,
    thumbnail_url: photo.urls.small,
    photographer: photo.user.name,
    photographer_url: `${photo.user.links.html}?${UTM}`,
    unsplash_url: `${photo.links.html}?${UTM}`,
});

export const searchPhotos = async (query: string, perPage: number, orientation?: string): Promise<PhotoSummary[]> => {
    const params = new URLSearchParams({ query, per_page: String(perPage) });
    if (orientation) params.set('orientation', orientation);
    const data = await unsplashFetch<{ results: UnsplashPhoto[] }>(`/search/photos?${params}`);
    return data.results.map(summarizePhoto);
};

/** Resolves a photo and triggers Unsplash's download tracking, as required by the API guidelines. */
export const getPhotoForUse = async (id: string): Promise<PhotoSummary> => {
    const photo = await unsplashFetch<UnsplashPhoto>(`/photos/${encodeURIComponent(id)}`);
    const { pathname, search } = new URL(photo.links.download_location);
    await unsplashFetch(pathname + search).catch(() => undefined);
    return summarizePhoto(photo);
};
