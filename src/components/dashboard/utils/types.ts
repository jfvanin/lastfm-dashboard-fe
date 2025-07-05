import type { TopAlbumsResponse, TopArtistsResponse, TopTracksResponse } from '@/api/lastFmApi';
import type { Top5Statistics } from '@/api/api';

export interface ChartSeries {
    name?: string;
    data: number[] | { x: string; y: number }[];
}

export interface ChartOptions {
    labels: string[];
    theme: {
        palette: string;
    };
    tooltip?: {
        theme: string;
    };
    title: {
        text: string;
        align: string;
        style: {
            color: string;
            fontSize: string;
        };
    };
    chart: {
        type: string;
        stacked?: boolean;
        stackType?: string;
    };
    plotOptions: {
        bar?: {
            columnWidth: string;
            distributed: boolean;
        };
        treemap?: {
            distributed: boolean;
            enableShades: boolean;
        };
    };
    dataLabels: {
        enabled: boolean;
    };
    legend: {
        show: boolean;
        labels?: {
            colors: string;
        };
    };
    xaxis: {
        categories: string[];
        labels: {
            style: {
                colors: string;
                fontSize: string;
            };
            rotate?: number;
        };
    };
    yaxis?: {
        title?: string;
        labels: {
            style: {
                colors: string;
            };
        };
    } | Array<{
        title: string;
        labels: {
            style: {
                colors: string;
            };
        };
    }>;
}

export interface ChartConfig {
    series: ChartSeries[];
    chartOptions: ChartOptions;
}

export interface DashboardState {
    years: number[];
    selectedYear: number;
    loading: boolean;
    topArtists: TopArtistsResponse;
    topAlbums: TopAlbumsResponse;
    topTracks: TopTracksResponse;
    listTop5: Top5Statistics;
    fullDecadesChart: ChartConfig;
    fullOriginChart: ChartConfig;
    fullTagsChart: ChartConfig;
    originChart: ChartConfig;
    decadesChart: ChartConfig;
    tagChart: ChartConfig;
}

export type ChartType = 'decades' | 'origin' | 'tags';
export type ViewMode = 'full' | 'single';
