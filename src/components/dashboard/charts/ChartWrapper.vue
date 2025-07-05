<template>
    <apexchart :ref="chartRef" :type="type" :height="height" :class="wrapperClass" :options="options"
        :series="series" />
</template>

<script setup lang="ts">
    import { defineProps, defineExpose, ref } from 'vue';
    import type ApexCharts from 'apexcharts';
    import type { ChartOptions, ChartSeries } from '../utils/types';

    interface Props {
        type: string;
        height?: string | number;
        wrapperClass?: string;
        options: ChartOptions;
        series: ChartSeries[];
    }

    defineProps<Props>();

    const chartRef = ref<ApexCharts | null>(null);

    defineExpose({
        chartRef
    });
</script>
