<template>
    <div>
        <div class="flex flex-wrap ml-3 mr-4">
            <ChartWrapper ref="chartDecadesRef" type="bar" wrapper-class="flex-1 min-w-[380px]"
                :options="decadesChart.chartOptions" :series="decadesChart.series" />
            <ChartWrapper ref="chartOriginRef" type="bar" wrapper-class="flex-1 min-w-[380px]"
                :options="originChart.chartOptions" :series="originChart.series" />
            <ChartWrapper ref="chartTagsRef" type="treemap" wrapper-class="flex-1 min-w-[380px]"
                :options="tagChart.chartOptions" :series="tagChart.series" />
        </div>
        <TopListsDisplay :list-top5="listTop5" />
    </div>
</template>

<script setup lang="ts">
    import { defineExpose, ref } from 'vue';
    import ChartWrapper from './ChartWrapper.vue';
    import TopListsDisplay from '../displays/TopListsDisplay.vue';
    import type { ChartConfig } from '../utils/types';
    import type { Top5Statistics } from '@/api/api';

    defineProps<{
        decadesChart: ChartConfig;
        originChart: ChartConfig;
        tagChart: ChartConfig;
        listTop5: Top5Statistics;
    }>();

    const chartDecadesRef = ref();
    const chartOriginRef = ref();
    const chartTagsRef = ref();

    defineExpose({
        chartDecadesRef: () => chartDecadesRef.value?.chartRef,
        chartOriginRef: () => chartOriginRef.value?.chartRef,
        chartTags: () => chartTagsRef.value?.chartRef
    });
</script>
