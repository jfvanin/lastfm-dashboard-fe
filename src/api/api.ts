import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL + '/.netlify/functions';

export interface UserDetails {
    name: string;
    discoguser: string | null;
    years: string;
}

export const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        //'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
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

export const post = async (endpoint: string, data = {}) => {
    try {
        const response = await apiClient.postForm(endpoint, data);
        return response.data;
    } catch (error) {
        console.error('PUT request failed:', error);
        throw error;
    }
};

export const loadUserDetails = async (user: string): Promise<UserDetails> => {
    const endpoint = `/load_user_details`;
    const params: { user: string } = { user };
    return await get(endpoint, params);
};

export const setDiscogUserToLastfmUser = async (user: string, discogUser: string | null) => {
    const endpoint = `/update_user`;
    const data: { user: string; discogUser: string | null, clearDiscogUser?: boolean | null } = {
        user,
        discogUser,
        ...(!discogUser ? { clearDiscogUser: true } : {}),
    };
    return await post(endpoint, data);
};

export const setYearsToUser = async (user: string, years: number[]) => {
    const endpoint = `/update_user`;
    const data: { user: string; years: string } = { user, years: JSON.stringify(years) };
    return await post(endpoint, data);
};

export const loadOriginStatistics = async (user: string, year?: number | null) => {
    const endpoint = `/load_artist_origin_statistics`;
    const params: { user: string; year?: number } = { user };
    if (year) {
        params.year = year;
    }
    return await get(endpoint, params);
};

export const loadTagsStatistics = async (user: string, year?: number | null) => {
    const endpoint = `/load_tags_statistics`;
    const params: { user: string; year?: number } = { user };
    if (year) {
        params.year = year;
    }
    return await get(endpoint, params);
};

export const loadDecadeStatistics = async (user: string, year?: number | null) => {
    const endpoint = `/load_decade_statistics`;
    const params: { user: string; year?: number } = { user };
    if (year) {
        params.year = year;
    }
    return await get(endpoint, params);
};

export const loadTagStatistics = async (user: string, year?: number | null) => {
    const endpoint = `/load_tags_statistics`;
    const params: { user: string; year?: number } = { user };
    if (year) {
        params.year = year;
    }
    return await get(endpoint, params);
};