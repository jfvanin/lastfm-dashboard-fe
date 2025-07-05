import { describe, it, expect } from 'vitest';
import { useChartConfiguration } from '../useChartConfiguration';

describe('useChartConfiguration', () => {
    it('should initialize chart configurations with correct theme', () => {
        const theme = 'palette7';
        const config = useChartConfiguration(theme);

        expect(config.fullDecadesChart.chartOptions.theme.palette).toBe(theme);
        expect(config.fullOriginChart.chartOptions.theme.palette).toBe(theme);
        expect(config.fullTagsChart.chartOptions.theme.palette).toBe(theme);
        expect(config.decadesChart.chartOptions.theme.palette).toBe(theme);
        expect(config.originChart.chartOptions.theme.palette).toBe(theme);
        expect(config.tagChart.chartOptions.theme.palette).toBe(theme);
    });

    it('should have different chart types', () => {
        const config = useChartConfiguration('palette1');

        expect(config.fullDecadesChart.chartOptions.chart.type).toBe('bar');
        expect(config.fullOriginChart.chartOptions.chart.type).toBe('bar');
        expect(config.fullTagsChart.chartOptions.chart.type).toBe('bar');
        expect(config.decadesChart.chartOptions.chart.type).toBe('bar');
        expect(config.originChart.chartOptions.chart.type).toBe('bar');
        expect(config.tagChart.chartOptions.chart.type).toBe('treemap');
    });

    it('should update theme for all charts', () => {
        const config = useChartConfiguration('palette1');
        const newTheme = 'palette9';

        config.updateTheme(newTheme);

        expect(config.fullDecadesChart.chartOptions.theme.palette).toBe(newTheme);
        expect(config.fullOriginChart.chartOptions.theme.palette).toBe(newTheme);
        expect(config.fullTagsChart.chartOptions.theme.palette).toBe(newTheme);
        expect(config.decadesChart.chartOptions.theme.palette).toBe(newTheme);
        expect(config.originChart.chartOptions.theme.palette).toBe(newTheme);
        expect(config.tagChart.chartOptions.theme.palette).toBe(newTheme);
    });

    it('should have reactive chart configurations', () => {
        const config = useChartConfiguration('palette1');

        // Test that configurations are reactive objects
        expect(config.fullDecadesChart).toBeDefined();
        expect(config.fullDecadesChart.series).toBeDefined();
        expect(config.fullDecadesChart.chartOptions).toBeDefined();

        // Test initial series structure
        expect(config.fullDecadesChart.series).toHaveLength(1);
        expect(config.fullDecadesChart.series[0].name).toBe('');
        expect(config.fullDecadesChart.series[0].data).toEqual([]);
    });

    it('should have correct stacked configuration for full charts', () => {
        const config = useChartConfiguration('palette1');

        expect(config.fullDecadesChart.chartOptions.chart.stacked).toBe(true);
        expect(config.fullOriginChart.chartOptions.chart.stacked).toBe(true);
        expect(config.fullTagsChart.chartOptions.chart.stacked).toBe(true);
    });

    it('should have correct legend settings', () => {
        const config = useChartConfiguration('palette1');

        // Full charts should show legend
        expect(config.fullDecadesChart.chartOptions.legend.show).toBe(true);
        expect(config.fullOriginChart.chartOptions.legend.show).toBe(true);
        expect(config.fullTagsChart.chartOptions.legend.show).toBe(true);

        // Single charts should not show legend (except tag chart)
        expect(config.decadesChart.chartOptions.legend.show).toBe(false);
        expect(config.originChart.chartOptions.legend.show).toBe(false);
        expect(config.tagChart.chartOptions.legend.show).toBe(false);
    });
});
