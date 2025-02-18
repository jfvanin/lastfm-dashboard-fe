import axios from 'axios';

const BASE_DISCOGS_URL = 'https://api.discogs.com';
const DISCOGS_API_KEY = import.meta.env.VITE_DISCOGS_API_KEY;
const DISCOGS_API_SECRET = import.meta.env.VITE_DISCOGS_API_SECRET;

export interface DiscogsRelease {
    id: number;
    instance_id: number;
    date_added: string;
    rating: number;
    basic_information: {
        id: number;
        master_id: number;
        master_url: string;
        resource_url: string;
        thumb: string;
        cover_image: string;
        title: string;
        year: number;
        formats: {
            name: string;
            qty: string;
            text: string;
            descriptions: string[];
        }[];
        labels: {
            name: string;
            catno: string;
            entity_type: string;
            entity_type_name: string;
            id: number;
            resource_url: string;
        }[];
        artists: {
            name: string;
            anv: string;
            join: string;
            role: string;
            tracks: string;
            id: number;
            resource_url: string;
        }[];
        genres: string[];
        styles: string[];
    };
}

export interface DiscogsTrack {
    position: string;
    type_: string;
    title: string;
    duration: string;
    extraartists?: {
        name: string;
        anv: string;
        join: string;
        role: string;
        tracks: string;
        id: number;
        resource_url: string;
    }[];
}

export interface DiscogsReleaseDetails {
    id: number;
    title: string;
    year: number;
    resource_url: string;
    tracklist: DiscogsTrack[];
    formats: {
        name: string;
        qty: string;
        text: string;
        descriptions: string[];
    }[];
    labels: {
        name: string;
        catno: string;
        entity_type: string;
        entity_type_name: string;
        id: number;
        resource_url: string;
    }[];
    artists: {
        name: string;
        anv: string;
        join: string;
        role: string;
        tracks: string;
        id: number;
        resource_url: string;
    }[];
    genres: string[];
    styles: string[];
}

export interface DiscogsCollectionResponse {
    pagination: {
        per_page: number;
        items: number;
        page: number;
        urls: {
            last: string;
            next: string;
        };
        pages: number;
    };
    releases: DiscogsRelease[];
}

export const apiClient = axios.create({
    baseURL: BASE_DISCOGS_URL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Discogs key=${DISCOGS_API_KEY}, secret=${DISCOGS_API_SECRET}`
    },
});

export const get = async (endpoint: string, params = {}) => {
    try {
        const response = await apiClient.get(endpoint, { params });
        return response.data;
    } catch (error) {
        console.error('GET request failed:', error);
        throw error;
    }
};

export const loadUserLibrary = async (username: string): Promise<DiscogsRelease[]> => {
    let url: string | null = `/users/${username}/collection/folders/0/releases`;
    let allReleases: DiscogsRelease[] = [];
    let page = 1;
    const perPage = 50; // Number of items per page
    const params: { page: number; per_page?: number, sort: string } = { page, per_page: perPage, sort: 'artist' };

    while (url) {
        params.page = page;
        const data: DiscogsCollectionResponse = await get(url, params);
        allReleases = allReleases.concat(data.releases);

        // Check if there are more pages
        if (data.pagination && data.pagination.pages > page) {
            page++;
        } else {
            url = null;
        }
    }

    return allReleases;
};

export const getReleaseDetails = async (releaseId: number): Promise<DiscogsReleaseDetails> => {
    const url = `/releases/${releaseId}`;

    const data: DiscogsReleaseDetails = await get(url);
    return data;
};
