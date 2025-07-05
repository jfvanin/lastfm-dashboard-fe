import { ref, reactive } from 'vue';
import {
    loadDecadeStatistics,
    loadGeneralStatistics,
    loadOriginStatistics,
    loadTagStatistics,
    type Top5Statistics
} from '@/api/api';
import {
    getTopAlbums,
    getTopArtist,
    getTopTracks,
    type TopAlbumsResponse,
    type TopArtistsResponse,
    type TopTracksResponse
} from '@/api/lastFmApi';
import { processDecadeData, processCountryData, processTagData } from '../utils/chartHelpers';
import type { ChartConfig } from '../utils/types';

interface ChartConfigs {
    fullDecadesChart: ChartConfig;
    fullOriginChart: ChartConfig;
    fullTagsChart: ChartConfig;
    decadesChart: ChartConfig;
    originChart: ChartConfig;
    tagChart: ChartConfig;
}

export function useChartData() {
    const loading = ref(false);

    const data = reactive({
        topArtists: {} as TopArtistsResponse,
        topAlbums: {} as TopAlbumsResponse,
        topTracks: {} as TopTracksResponse,
        listTop5: {} as Top5Statistics
    });

    const fetchDecadeStatistics = async (user: string, selectedYear: number, chartConfigs: ChartConfigs) => {
        if (!user) return;

        try {
            loading.value = true;
            const response = await loadDecadeStatistics(user, selectedYear > 0 ? selectedYear : null);

            if (selectedYear === -1) {
                const categories = response.map((x: { _id: string }) => x._id);
                chartConfigs.fullDecadesChart.chartOptions.xaxis.categories = categories;
                chartConfigs.fullDecadesChart.series = processDecadeData(response, categories);
            } else {
                chartConfigs.decadesChart.chartOptions.xaxis.categories = response.map((x: { _id: string, count: number }) => x._id);
                chartConfigs.decadesChart.series[0].data = response.map((x: { _id: string, count: number }) => x.count);
            }
        } catch (error) {
            console.error('Error loading decade statistics:', error);
        } finally {
            loading.value = false;
        }
    };

    const fetchOriginStatistics = async (user: string, selectedYear: number, chartConfigs: ChartConfigs) => {
        if (!user) return;

        try {
            loading.value = true;
            const response = await loadOriginStatistics(user, selectedYear > 0 ? selectedYear : null);

            if (selectedYear === -1) {
                const categories = response.map((x: { _id: string }) => x._id);
                chartConfigs.fullOriginChart.chartOptions.xaxis.categories = categories;
                chartConfigs.fullOriginChart.series = processCountryData(response, categories);
            } else {
                chartConfigs.originChart.chartOptions.xaxis.categories = response.map((x: { _id: string, count: number }) => x._id);
                chartConfigs.originChart.series[0].data = response.map((x: { _id: string, count: number }) => x.count);
            }
        } catch (error) {
            console.error('Error loading origin statistics:', error);
        } finally {
            loading.value = false;
        }
    };

    const fetchTagStatistics = async (user: string, selectedYear: number, chartConfigs: ChartConfigs) => {
        if (!user) return;

        try {
            loading.value = true;
            const response = await loadTagStatistics(user, selectedYear > 0 ? selectedYear : null);

            if (selectedYear === -1) {
                const categories = response.map((x: { _id: string }) => x._id);
                chartConfigs.fullTagsChart.chartOptions.xaxis.categories = categories;
                chartConfigs.fullTagsChart.series = processTagData(response, categories);
            } else {
                chartConfigs.tagChart.series[0].data = response.map((x: { _id: string, count: number }) => ({ x: x._id, y: x.count }));
            }
        } catch (error) {
            console.error('Error loading tag statistics:', error);
        } finally {
            loading.value = false;
        }
    };

    const fetchGeneralStatistics = async (user: string, selectedYear: number) => {
        if (!user || selectedYear <= 0) return;

        try {
            loading.value = true;
            data.listTop5 = await loadGeneralStatistics(user, selectedYear);
        } catch (error) {
            console.error('Error loading general statistics:', error);
        } finally {
            loading.value = false;
        }
    };

    const fetchLastFmData = async (user: string, selectedYear: number) => {
        if (!user || selectedYear !== -1) return;

        try {
            data.topArtists = await getTopArtist(user);
            data.topAlbums = await getTopAlbums(user);
            data.topTracks = await getTopTracks(user);
        } catch (error) {
            console.error('Error loading lastfm statistics:', error);
        }
    };

    const fetchAllData = async (user: string, selectedYear: number, chartConfigs: ChartConfigs) => {
        if (!user) return;

        await Promise.all([
            fetchDecadeStatistics(user, selectedYear, chartConfigs),
            fetchOriginStatistics(user, selectedYear, chartConfigs),
            fetchTagStatistics(user, selectedYear, chartConfigs),
            fetchLastFmData(user, selectedYear),
            fetchGeneralStatistics(user, selectedYear)
        ]);
    };

    return {
        loading,
        data,
        fetchDecadeStatistics,
        fetchOriginStatistics,
        fetchTagStatistics,
        fetchGeneralStatistics,
        fetchLastFmData,
        fetchAllData
    };
}
