import { describe, it, expect } from 'vitest';
import {
    createDecadesChartConfig,
    createOriginChartConfig,
    createTagChartConfig,
    createFullDecadesChartConfig,
    createFullOriginChartConfig,
    createFullTagsChartConfig
} from '../chartConfigs';

describe('chartConfigs', () => {
    const testTheme = 'palette5';

    describe('createDecadesChartConfig', () => {
        it('should create decades chart config with correct theme', () => {
            const config = createDecadesChartConfig(testTheme);

            expect(config.series).toHaveLength(1);
            expect(config.series[0].data).toEqual([]);
            expect(config.chartOptions.theme.palette).toBe(testTheme);
            expect(config.chartOptions.title.text).toBe('Albums\' Decades');
            expect(config.chartOptions.chart.type).toBe('bar');
            expect(config.chartOptions.legend.show).toBe(false);
        });

        it('should use default theme when none provided', () => {
            const config = createDecadesChartConfig('');
            expect(config.chartOptions.theme.palette).toBe('palette10');
        });
    });

    describe('createOriginChartConfig', () => {
        it('should create origin chart config with correct properties', () => {
            const config = createOriginChartConfig(testTheme);

            expect(config.chartOptions.title.text).toBe('Artists\' Country of Origin');
            expect(config.chartOptions.xaxis.labels.style.fontSize).toBe('10px');
            expect(config.chartOptions.xaxis.labels.rotate).toBe(0);
            expect(config.chartOptions.theme.palette).toBe(testTheme);
        });
    });

    describe('createTagChartConfig', () => {
        it('should create tag chart config with treemap type', () => {
            const config = createTagChartConfig(testTheme);

            expect(config.chartOptions.chart.type).toBe('treemap');
            expect(config.chartOptions.title.text).toBe('Music Main Tags');
            expect(config.chartOptions.theme.palette).toBe(testTheme);
            expect(config.chartOptions.plotOptions.treemap?.distributed).toBe(true);
            expect(config.chartOptions.plotOptions.treemap?.enableShades).toBe(false);
        });
    });

    describe('createFullDecadesChartConfig', () => {
        it('should create full decades chart config with stacked properties', () => {
            const config = createFullDecadesChartConfig(testTheme);

            expect(config.chartOptions.chart.stacked).toBe(true);
            expect(config.chartOptions.chart.stackType).toBe('100%');
            expect(config.chartOptions.legend.show).toBe(true);
            expect(config.chartOptions.tooltip?.theme).toBe('dark');
        });
    });

    describe('createFullOriginChartConfig', () => {
        it('should create full origin chart config', () => {
            const config = createFullOriginChartConfig(testTheme);

            expect(config.chartOptions.title.text).toBe('Artists\' Country of Origin');
            expect(config.chartOptions.chart.stacked).toBe(true);
            expect(config.series[0].name).toBe('');
        });
    });

    describe('createFullTagsChartConfig', () => {
        it('should create full tags chart config', () => {
            const config = createFullTagsChartConfig(testTheme);

            expect(config.chartOptions.title.text).toBe('Top 10 Main Tags by Year');
            expect(config.chartOptions.chart.stacked).toBe(true);
        });
    });
});
