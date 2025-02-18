import axios from 'axios';
import CryptoJS from 'crypto-js';
import { getReleaseDetails } from './discogsApi';

const LFM_API_KEY = import.meta.env.VITE_LASTFM_API_KEY;
const LFM_SECRET = import.meta.env.VITE_LASTFM_API_SECRET;

export interface TopArtist {
    name: string;
    playcount: string;
    listeners: string;
    mbid: string;
    url: string;
    streamable: string;
    image: Array<{ '#text': string; size: string }>;
}

export interface TopArtistsResponse {
    topartists: {
        artist: TopArtist[];
    };
}

export interface TopAlbum {
    name: string;
    playcount: number;
    mbid: string;
    url: string;
    artist: {
        name: string;
        mbid: string;
        url: string;
    };
    image: Array<{ '#text': string; size: string }>;
}

export interface TopAlbumsResponse {
    topalbums: {
        album: TopAlbum[];
    };
}

export interface TopTrack {
    name: string;
    playcount: number;
    listeners: number;
    mbid: string;
    url: string;
    artist: {
        name: string;
        mbid: string;
        url: string;
    };
    image: Array<{ '#text': string; size: string }>;
}

export interface TopTracksResponse {
    toptracks: {
        track: TopTrack[];
    };
}

export const apiClient = axios.create({
    baseURL: 'https://ws.audioscrobbler.com/2.0',
    headers: {
        'User-Agent': import.meta.env.VITE_USER_AGENT + ' (jozeh5@gmail.com)'
    }
});

export const get = async (endpoint: string, params: { [key: string]: string } = {}, signatureRequired = true) => {
    try {
        params = {
            ...params,
            api_key: LFM_API_KEY,
        };
        const api_sig = CryptoJS.MD5(Object.keys(params).sort().map(key => `${key}${params[key]}`).join('') + LFM_SECRET).toString();
        const response = await apiClient.get(endpoint,
            {
                params:
                {
                    ...params,
                    ...(signatureRequired ? { api_sig } : {}),
                    format: 'json'
                }
            });
        return response.data;
    } catch (error) {
        console.error('GET request failed:', error);
        throw error;
    }
};

export const post = async (endpoint: string, params: { [key: string]: string } = {}) => {
    try {
        params = {
            ...params,
            api_key: LFM_API_KEY,
            sk: localStorage.getItem('lastfm-session') || '',
        };
        const api_sig = CryptoJS.MD5(Object.keys(params).sort().map(key => `${key}${params[key]}`).join('') + LFM_SECRET).toString();

        const response = await apiClient.post(endpoint, new URLSearchParams({ ...params, api_sig }));
        return response.data;
    } catch (error) {
        console.error('GET request failed:', error);
        throw error;
    }
};

export const getLastFMSession = async (token: string) => {
    const params = {
        method: 'auth.getSession',
        token,
    }
    const response = await get('/', params);
    localStorage.setItem('lastfm-session', response.session.key);
    return response.session.key;
}

export const scrobbleLastFM = async (albumId: number, artists: string[], albumName: string): Promise<{ accepted: number, ignored: number }> => {
    const tracks = await getReleaseDetails(albumId);
    const scrobbles: { track: string; artist: string; albumArtist: string; album: string; timestamp: number; duration?: number; }[] = [];
    let currentTimestamp = Math.floor(Date.now() / 1000);
    artists = artists.map(artist => artist.replace(/\s*\(\d+\)$/, ''));

    tracks.tracklist.forEach((track: { title: string; duration: string }) => {
        let durationInSeconds = 120; // If track does not have duration, will leave it with default of 2 minutes
        if (track.duration) {
            const [minutes, seconds] = track.duration.split(':').map(Number);
            durationInSeconds = (minutes * 60) + seconds;
        }
        scrobbles.push({
            track: track.title,
            artist: artists[0],
            albumArtist: artists[0],
            album: albumName,
            timestamp: currentTimestamp,
            duration: durationInSeconds,
        });
        currentTimestamp += durationInSeconds;
    });

    const scrobbleParams = scrobbles.reduce((acc: { [key: string]: unknown }, scrobble, index) => {
        acc[`track[${index}]`] = scrobble.track;
        acc[`artist[${index}]`] = scrobble.artist;
        acc[`albumartist[${index}]`] = scrobble.albumArtist;
        acc[`album[${index}]`] = scrobble.album;
        acc[`timestamp[${index}]`] = scrobble.timestamp;
        if (scrobble.duration) acc[`duration[${index}]`] = scrobble.duration;
        return acc;
    }, {});

    const result = await post('/', { method: 'track.scrobble', ...scrobbleParams });

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(result, "application/xml");
    const errorNode = xmlDoc.querySelector("scrobbles");

    return {
        accepted: Number(errorNode?.attributes.getNamedItem('accepted')?.value),
        ignored: Number(errorNode?.attributes.getNamedItem('ignored')?.value),
    };
}

export const getTopArtist = async (username: string): Promise<TopArtistsResponse> => {
    const params = {
        period: 'overall',
        limit: '10',
        user: username,
    };
    const result = await get('/', { method: 'user.gettopartists', ...params }, false);
    return result;
}

export const getTopAlbums = async (username: string): Promise<TopAlbumsResponse> => {
    const params = {
        period: 'overall',
        limit: '10',
        user: username,
    };
    const result = await get('/', { method: 'user.gettopalbums', ...params }, false);
    return result;
}

export const getTopTracks = async (username: string): Promise<TopTracksResponse> => {
    const params = {
        period: 'overall',
        limit: '10',
        user: username,
    };
    const result = await get('/', { method: 'user.gettoptracks', ...params }, false);
    return result;
}