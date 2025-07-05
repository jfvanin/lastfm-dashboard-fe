import { ref, reactive } from 'vue';
import {
    createDecadesChartConfig,
    createOriginChartConfig,
    createTagChartConfig,
    createFullDecadesChartConfig,
    createFullOriginChartConfig,
    createFullTagsChartConfig
} from '../utils/chartConfigs';

export function useChartConfiguration(initialTheme: string) {
    const currentTheme = ref(initialTheme);

    // Make chart configurations reactive
    const fullDecadesChart = reactive(createFullDecadesChartConfig(initialTheme));
    const fullOriginChart = reactive(createFullOriginChartConfig(initialTheme));
    const fullTagsChart = reactive(createFullTagsChartConfig(initialTheme));
    const decadesChart = reactive(createDecadesChartConfig(initialTheme));
    const originChart = reactive(createOriginChartConfig(initialTheme));
    const tagChart = reactive(createTagChartConfig(initialTheme));

    const updateTheme = (theme: string) => {
        currentTheme.value = theme;

        // Update all chart themes
        fullDecadesChart.chartOptions.theme.palette = theme;
        fullOriginChart.chartOptions.theme.palette = theme;
        fullTagsChart.chartOptions.theme.palette = theme;
        decadesChart.chartOptions.theme.palette = theme;
        originChart.chartOptions.theme.palette = theme;
        tagChart.chartOptions.theme.palette = theme;
    };

    return {
        fullDecadesChart,
        fullOriginChart,
        fullTagsChart,
        decadesChart,
        originChart,
        tagChart,
        updateTheme
    };
}
