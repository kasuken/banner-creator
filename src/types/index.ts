export interface UnsplashPhoto {
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

export interface BannerProperties {
    text: string;
    font: string;
    imageUrl: string;
}

export type { ImageFitMode } from '../../shared/presets';
