import type { ChartOptions } from './types';

const commonChartStyle = {
    color: '#f0f0f0',
    fontSize: '18px'
};

const commonAxisStyle = {
    colors: '#fff'
};

const createBaseBarChartOptions = (title: string, theme: string): ChartOptions => ({
    labels: [],
    theme: {
        palette: theme || 'palette10'
    },
    title: {
        text: title,
        align: 'center',
        style: commonChartStyle
    },
    chart: {
        type: 'bar',
    },
    plotOptions: {
        bar: {
            columnWidth: '70%',
            distributed: true,
        }
    },
    dataLabels: {
        enabled: true
    },
    legend: {
        show: false
    },
    xaxis: {
        categories: [],
        labels: {
            style: {
                colors: commonAxisStyle.colors,
                fontSize: '12px'
            }
        },
    },
    yaxis: {
        labels: {
            style: {
                colors: commonAxisStyle.colors,
            },
        },
    },
});

const createStackedBarChartOptions = (title: string, theme: string): ChartOptions => ({
    labels: [],
    theme: {
        palette: theme || 'palette10'
    },
    tooltip: {
        theme: 'dark',
    },
    title: {
        text: title,
        align: 'center',
        style: commonChartStyle
    },
    chart: {
        type: 'bar',
        stacked: true,
        stackType: '100%',
    },
    plotOptions: {
        bar: {
            columnWidth: '70%',
            distributed: false,
        }
    },
    dataLabels: {
        enabled: true
    },
    legend: {
        show: true,
        labels: {
            colors: '#f0f0f0',
        }
    },
    xaxis: {
        categories: [],
        labels: {
            style: {
                colors: commonAxisStyle.colors,
                fontSize: '12px'
            }
        },
    },
    yaxis: [
        {
            title: 'bar',
            labels: {
                style: {
                    colors: commonAxisStyle.colors,
                },
            },
        }
    ],
});

export const createDecadesChartConfig = (theme: string) => ({
    series: [{ data: [] }],
    chartOptions: createBaseBarChartOptions('Albums\' Decades', theme)
});

export const createOriginChartConfig = (theme: string) => {
    const options = createBaseBarChartOptions('Artists\' Country of Origin', theme);
    options.xaxis.labels.style.fontSize = '10px';
    options.xaxis.labels.rotate = 0;
    return {
        series: [{ data: [] }],
        chartOptions: options
    };
};

export const createTagChartConfig = (theme: string) => ({
    series: [{ data: [] }],
    chartOptions: {
        labels: [],
        legend: {
            show: false
        },
        theme: {
            palette: theme || 'palette7'
        },
        chart: {
            type: 'treemap'
        },
        title: {
            text: 'Music Main Tags',
            align: 'center',
            style: commonChartStyle
        },
        plotOptions: {
            treemap: {
                distributed: true,
                enableShades: false
            }
        },
        dataLabels: {
            enabled: true
        },
        xaxis: {
            categories: [],
            labels: {
                style: {
                    colors: commonAxisStyle.colors,
                    fontSize: '12px'
                }
            }
        }
    }
});

export const createFullDecadesChartConfig = (theme: string) => ({
    series: [{ name: '', data: [] }],
    chartOptions: createStackedBarChartOptions('Albums\' Decades', theme)
});

export const createFullOriginChartConfig = (theme: string) => ({
    series: [{ name: '', data: [] }],
    chartOptions: createStackedBarChartOptions('Artists\' Country of Origin', theme)
});

export const createFullTagsChartConfig = (theme: string) => ({
    series: [{ name: '', data: [] }],
    chartOptions: createStackedBarChartOptions('Top 10 Main Tags by Year', theme)
});
