<template>
    <div class="ml-3 mr-4">
        <ChartWrapper ref="chartFullDecadeRef" type="bar" height="350" :options="fullDecadesChart.chartOptions"
            :series="fullDecadesChart.series" />
        <ChartWrapper ref="chartFullOriginRef" type="bar" height="350" :options="fullOriginChart.chartOptions"
            :series="fullOriginChart.series" />
        <ChartWrapper ref="chartFullTagsRef" type="bar" height="350" :options="fullTagsChart.chartOptions"
            :series="fullTagsChart.series" />
        <LastFmAlbumsDisplay :top-albums="topAlbums" :top-tracks="topTracks" />
    </div>
</template>

<script setup lang="ts">
    import { defineExpose, ref } from 'vue';
    import ChartWrapper from './ChartWrapper.vue';
    import LastFmAlbumsDisplay from '../displays/LastFmAlbumsDisplay.vue';
    import type { ChartConfig } from '../utils/types';
    import type { TopAlbumsResponse, TopTracksResponse } from '@/api/lastFmApi';

    defineProps<{
        fullDecadesChart: ChartConfig;
        fullOriginChart: ChartConfig;
        fullTagsChart: ChartConfig;
        topAlbums: TopAlbumsResponse;
        topTracks: TopTracksResponse;
    }>();

    const chartFullDecadeRef = ref();
    const chartFullOriginRef = ref();
    const chartFullTagsRef = ref();

    defineExpose({
        chartFullDecadeRef: () => chartFullDecadeRef.value?.chartRef,
        chartFullOriginRef: () => chartFullOriginRef.value?.chartRef,
        chartFullTagsRef: () => chartFullTagsRef.value?.chartRef
    });
</script>
