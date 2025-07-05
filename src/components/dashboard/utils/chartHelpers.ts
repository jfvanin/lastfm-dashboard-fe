import type { Ref } from 'vue';
import type ApexCharts from 'apexcharts';
import type { ChartConfig } from './types';

interface DecadeResponse {
    _id: string;
    decades: { decade: string; count: number }[];
}

interface CountryResponse {
    _id: string;
    countries: { artistCountry: string; count: number }[];
}

interface TagResponse {
    _id: string;
    tags: { tag: string; count: number }[];
}

export const updateChartOptions = (chartRef: Ref<ApexCharts | null>, chartConfig: ChartConfig) => {
    if (chartRef.value) {
        chartRef.value.updateOptions(chartConfig.chartOptions);
        chartRef.value.updateSeries(chartConfig.series);
    }
};

export const updateThemeForAllCharts = (
    theme: string,
    chartConfigs: Record<string, ChartConfig>,
    chartRefs: Record<string, Ref<ApexCharts | null>>
) => {
    Object.keys(chartConfigs).forEach(key => {
        chartConfigs[key].chartOptions.theme.palette = theme;
        if (chartRefs[key]?.value) {
            chartRefs[key].value!.updateOptions(chartConfigs[key].chartOptions);
        }
    });
};

export const processDecadeData = (response: DecadeResponse[], categories: string[]) => {
    const decadesData: { [key: string]: number[] } = {};
    const decades = ['1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s'];

    decades.forEach(decade => {
        decadesData[decade] = Array(categories.length).fill(0);
    });

    response.forEach((yearData: DecadeResponse, index: number) => {
        yearData.decades.forEach((decadeDetails: { decade: string, count: number }) => {
            if (!decadesData[decadeDetails.decade]) {
                decadesData[decadeDetails.decade] = Array(categories.length).fill(0);
            }
            decadesData[decadeDetails.decade][index] = decadeDetails.count;
        });
    });

    return Object.keys(decadesData).map(decade => ({
        name: decade,
        data: decadesData[decade]
    }));
};

export const processCountryData = (response: CountryResponse[], categories: string[]) => {
    const countriesData: { [key: string]: number[] } = {};

    response.forEach((yearData: CountryResponse, index: number) => {
        yearData.countries.forEach((country: { artistCountry: string, count: number }) => {
            if (!countriesData[country.artistCountry]) {
                countriesData[country.artistCountry] = Array(categories.length).fill(0);
            }
            countriesData[country.artistCountry][index] = country.count;
        });
    });

    return Object.keys(countriesData).map(country => ({
        name: country,
        data: countriesData[country]
    }));
};

export const processTagData = (response: TagResponse[], categories: string[]) => {
    const tagsData: { [key: string]: number[] } = {};

    response.forEach((yearData: TagResponse, index: number) => {
        yearData.tags.forEach((tag: { tag: string, count: number }) => {
            if (!tagsData[tag.tag]) {
                tagsData[tag.tag] = Array(categories.length).fill(0);
            }
            tagsData[tag.tag][index] = tag.count;
        });
    });

    return Object.keys(tagsData).map(tag => ({
        name: tag,
        data: tagsData[tag]
    }));
};
