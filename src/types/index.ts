export interface Image {
    id: string;
    urls: {
        regular: string;
        small: string;
        thumb: string;
    };
    alt_description: string;
}

export interface BannerProperties {
    text: string;
    font: string;
    imageUrl: string;
}

export interface UnsplashResponse {
    results: Image[];
    total: number;
    total_pages: number;
}