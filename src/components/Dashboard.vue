<script setup lang="ts">
  import { reactive, onMounted, ref, watch, defineProps } from 'vue';
  import { loadDecadeStatistics, loadOriginStatistics, loadTagStatistics, setYearsToUser } from '@/api/api';
  import ApexCharts from 'apexcharts';
  import { VueSpinnerPie } from 'vue3-spinners';
  import { getTopAlbums, getTopArtist, getTopTracks, type TopAlbumsResponse, type TopArtistsResponse, type TopTracksResponse } from '@/api/lastFmApi';

  const chartFullDecadeRef = ref<ApexCharts | null>(null);
  const chartFullOriginRef = ref<ApexCharts | null>(null);

  const chartRef = ref<ApexCharts | null>(null);
  const chartRef2 = ref<ApexCharts | null>(null);
  const chartRef3 = ref<ApexCharts | null>(null);

  const props = defineProps({
    user: String,
    years: Array<number>,
  });

  const state = reactive({
    years: [2024], // Example years array
    selectedYear: -1,
    loading: false,
    topArtists: {} as TopArtistsResponse,
    topAlbums: {} as TopAlbumsResponse,
    topTracks: {} as TopTracksResponse,
    fullDecadesChart: {
      series: [{
        name: '',
        data: [] as number[],
      }],
      chartOptions: {
        labels: [],
        theme: {
          palette: 'palette10'
        },
        tooltip: {
          theme: 'dark',
        },

        title: {
          text: 'Albums\' Decades',
          align: 'center'
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
          show: true
        },
        xaxis: {
          categories: [],
          labels: {
            style: {
              colors: '#fff',
              fontSize: '12px'
            }
          },
        },
        yaxis: [
          {
            title: 'bar',
            labels: {
              style: {
                colors: '#fff',
              },
            },
          }
        ],
      },
    },
    fullOriginChart: {
      series: [{
        name: '',
        data: [] as number[],
      }],
      chartOptions: {
        labels: [],
        theme: {
          palette: 'palette10'
        },
        title: {
          text: 'Artits\' Country of Origin',
          align: 'center'
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
          show: true
        },
        xaxis: {
          categories: [],
          labels: {
            style: {
              colors: '#fff',
              fontSize: '12px'
            }
          },
        },
        yaxis: [
          {
            title: 'bar',
            labels: {
              style: {
                colors: '#fff',
              },
            },
          }
        ],
      },
    },
    originChart: {
      series: [{
        data: []
      }],
      chartOptions: {
        labels: [],
        theme: {
          palette: 'palette10'
        },
        title: {
          text: 'Artists\' Country of Origin',
          align: 'center'
        },
        chart: {
          type: 'bar',
          events: {
            click: function (chart, w, e) {
              // console.log(chart, w, e)
            }
          }
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
              colors: '#fff',
              fontSize: '10px',
            },
            rotate: 0,
          }
        },
        yaxis: {
          labels: {
            style: {
              colors: '#fff',
            },
          },
        },
      },
    },
    decadesChart: {
      series: [{
        data: []
      }],
      chartOptions: {
        labels: [],
        theme: {
          palette: 'palette10'
        },
        title: {
          text: 'Albums\' Decades',
          align: 'center'
        },
        chart: {
          type: 'bar',
          events: {
            click: function (chart, w, e) {
              // console.log(chart, w, e)
            }
          }
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
              colors: '#fff',
              fontSize: '12px'
            }
          },
        },
        yaxis: {
          labels: {
            style: {
              colors: '#fff',
            },
          },
        },
      },
    },
    tagChart: {
      series: [{
        data: []
      }],
      chartOptions: {
        legend: {
          show: false
        },
        theme: {
          palette: 'palette7'
        },
        chart: {
          type: 'treemap'
        },
        title: {
          text: 'Music Main Tags',
          align: 'center'
        },
        plotOptions: {
          treemap: {
            distributed: true,
            enableShades: false
          }
        }
      },
    },
  });

  const fetchDecadeStatistics = async () => {
    const lastfmUser = props.user;
    if (lastfmUser) {
      try {
        state.loading = true;
        const response = (await loadDecadeStatistics(String(lastfmUser), state.selectedYear > 0 ? state.selectedYear : null));
        if (state.selectedYear === -1) {
          state.fullDecadesChart.chartOptions.xaxis.categories = response.map((x: { _id: string }) => x._id);
          const decadesData: { [key: string]: number[] } = {};
          decadesData['1950s'] = Array(state.fullDecadesChart.chartOptions.xaxis.categories.length).fill(0);

          response.forEach((yearData: { _id: string, decades: { decade: string, count: number }[] }, index: number) => {
            yearData.decades.forEach((decadeDetails: { decade: string, count: number }) => {
              if (!decadesData[decadeDetails.decade]) {
                decadesData[decadeDetails.decade] = Array(state.fullDecadesChart.chartOptions.xaxis.categories.length).fill(0);
              }
              decadesData[decadeDetails.decade][index] = decadeDetails.count;
            });
          });

          state.fullDecadesChart.series = Object.keys(decadesData).map(decade => ({
            name: decade,
            data: decadesData[decade]
          }));
        } else {
          state.decadesChart.chartOptions.xaxis.categories = response.reverse().map((x: { _id: string, count: number }) => x._id);
          state.decadesChart.series[0].data = response.reverse().map((x: { _id: string, count: number }) => x.count);
        }
      } catch (error) {
        console.error('Error loading decade statistics:', error);
      }
      state.loading = false;
    }
  };

  const fetchOriginStatistics = async () => {
    const lastfmUser = props.user;
    if (lastfmUser) {
      try {
        state.loading = true;
        const response = (await loadOriginStatistics(String(lastfmUser), state.selectedYear > 0 ? state.selectedYear : null));
        if (state.selectedYear === -1) {
          state.fullOriginChart.chartOptions.xaxis.categories = response.map((x: { _id: string }) => x._id);
          const countriesData: { [key: string]: number[] } = {};

          response.forEach((yearData: { _id: string, countries: { artistCountry: string, count: number }[] }, index: number) => {
            yearData.countries.forEach((country: { artistCountry: string, count: number }) => {
              if (!countriesData[country.artistCountry]) {
                countriesData[country.artistCountry] = Array(state.fullOriginChart.chartOptions.xaxis.categories.length).fill(0);
              }
              countriesData[country.artistCountry][index] = country.count;
            });
          });

          state.fullOriginChart.series = Object.keys(countriesData).map(country => ({
            name: country,
            data: countriesData[country]
          }));
        } else {
          state.originChart.chartOptions.xaxis.categories = response.map((x: { _id: string, count: number }) => x._id);
          state.originChart.series[0].data = response.map((x: { _id: string, count: number }) => x.count);
        }
      } catch (error) {
        console.error('Error loading origin statistics:', error);
      }
      state.loading = false;
    }
  };

  const fetchTagStatistics = async () => {
    const lastfmUser = props.user;
    if (lastfmUser) {
      state.loading = true;
      try {
        const response = (await loadTagStatistics(String(lastfmUser), state.selectedYear > 0 ? state.selectedYear : null));
        state.tagChart.series[0].data = response.map((x: { _id: string, count: number }) => ({ x: x._id, y: x.count }));
      } catch (error) {
        console.error('Error loading tag statistics:', error);
      }
      state.loading = false;
    }
  };

  const fetchLastFmData = async () => {
    const lastfmUser = props.user;
    if (lastfmUser && !state.year) {
      try {
        state.topArtists = (await getTopArtist(String(lastfmUser)));
        state.topAlbums = (await getTopAlbums(String(lastfmUser)));
        state.topTracks = (await getTopTracks(String(lastfmUser)));

        console.log(state.topArtists);
        console.log(state.topTracks);
      } catch (error) {
        console.error('Error loading lastfm statistics:', error);
      }
    }
  };

  const addYear = () => {
    if (props.user) {
      const minYear = Math.min(...state.years);
      state.years.push(minYear - 1);
      setYearsToUser(props.user, state.years);
      localStorage.setItem('lastfm-years', JSON.stringify(state.years));
    }
  };

  onMounted(async () => {
    if (props.years) {
      state.years = props.years;
    }
    if (props.user) {
      fetchDecadeStatistics();
      fetchOriginStatistics();
      fetchTagStatistics();
      fetchLastFmData();
    } else {
      console.log('User is not set');
    }
  });

  watch(() => [
    state.decadesChart.series,
    state.decadesChart.chartOptions.xaxis.categories,
  ], () => {
    if (chartRef.value) {
      chartRef.value.updateOptions(state.decadesChart.chartOptions);
      chartRef.value.updateSeries(state.decadesChart.series);
    }
  });

  watch(() => [
    state.originChart.series,
    state.originChart.chartOptions.xaxis.categories,
  ], () => {
    if (chartRef2.value) {
      chartRef2.value.updateOptions(state.originChart.chartOptions);
      chartRef2.value.updateSeries(state.originChart.series);
    }
  });

  watch(() => [
    state.tagChart.series,
  ], () => {
    if (chartRef3.value) {
      chartRef3.value.updateOptions(state.tagChart.chartOptions);
      chartRef3.value.updateSeries(state.tagChart.series);
    }
  });

  watch(() => [
    state.fullDecadesChart.series,
    state.fullDecadesChart.chartOptions.xaxis.categories,
  ], () => {
    if (chartFullDecadeRef.value) {
      chartFullDecadeRef.value.updateOptions(state.fullDecadesChart.chartOptions);
      chartFullDecadeRef.value.updateSeries(state.fullDecadesChart.series);
    }
  });

  watch(() => [
    state.fullOriginChart.series,
    state.fullOriginChart.chartOptions.xaxis.categories,
  ], () => {
    if (chartFullOriginRef.value) {
      chartFullOriginRef.value.updateOptions(state.fullOriginChart.chartOptions);
      chartFullOriginRef.value.updateSeries(state.fullOriginChart.series);
    }
  });

  watch(() => [props.user, state.selectedYear], () => {
    fetchDecadeStatistics();
    fetchOriginStatistics();
    fetchTagStatistics();
    fetchLastFmData();
  });

  watch(() => [props.years], () => {
    if (props.years) {
      state.years = props.years;
    }
  });

</script>

<template>
  <div>
    <div class="tabs flex gap-3 mb-5">
      <button class="px-4 py-2 min-w-10 text-center" :key="-1" @click="state.selectedYear = -1"
        :class="{ 'active-tab': state.selectedYear === -1 }">
        All years
      </button>
      <button v-for="year in state.years" class="px-4 py-2 min-w-3 break-all" :key="year"
        @click="state.selectedYear = year" :class="{ 'active-tab': state.selectedYear === year }">
        {{ year }}
      </button>
      <button class="px-4 py-2 min-w-3 break-all" @click="addYear">
        <strong>+</strong>
      </button>
    </div>
    <div v-if="state.loading" class="text-center">
      <VueSpinnerPie size="40" color="#7d02eb" class="text-center m-auto mb-3 mt-24" />
      <p>Fetching data...</p>
    </div>
    <div v-else-if="state.selectedYear === -1" class="ml-3 mr-4">
      <apexchart height="350" ref="chartFullDecadeRef" type="bar" :options="state.fullDecadesChart.chartOptions"
        :series="state.fullDecadesChart.series"></apexchart>
      <apexchart height="350" ref="chartFullOriginRef" type="bar" :options="state.fullOriginChart.chartOptions"
        :series="state.fullOriginChart.series"></apexchart>
      <div v-if="state.topTracks.toptracks" class="mx-6">
        <span class="text-xl">Top Albums</span>
        <ul class="flex flex-wrap my-2">
          <li v-for="album in state.topAlbums.topalbums.album" :key="album.name"
            class="flex-1 relative min-w-20 basis-24 max-w-44">
            <img :src="album.image[3]['#text']" alt="album" class="album-thumb w-full border-l-2 border-slate-950" />
            <div class="h-14 absolute -mt-14 block w-full bg-gradient-to-t to-transparent from-black">
              <span
                class="text-xs font-bold mt-4 text-white ml-1 w-full overflow-hidden text-ellipsis whitespace-nowrap block">
                {{ album.name }}
              </span>
              <span class="text-xs text-white ml-1 block">{{ album.playcount }} plays</span>
            </div>
          </li>
        </ul>
        <span class="text-xl">Top Artists</span>
        <ul class="flex flex-wrap my-2">
          <li v-for="artist in state.topArtists.topartists.artist" :key="artist.name"
            class="flex-1 relative min-w-20 basis-24 max-w-44">
            <img :src="artist.image[3]['#text']" alt="album" class="album-thumb w-full border-l-2 border-slate-950" />
            <div class="h-14 absolute -mt-14 block w-full bg-gradient-to-t to-transparent from-black">
              <span
                class="text-xs font-bold mt-4 text-white ml-1 w-full overflow-hidden text-ellipsis whitespace-nowrap block">
                {{ artist.name }}
              </span>
              <span class="text-xs text-white ml-1 block">{{ artist.playcount }} plays</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div v-else class="flex ml-3 mr-4">
      <apexchart class="flex-1" ref="chartRef" type="bar" :options="state.decadesChart.chartOptions"
        :series="state.decadesChart.series"></apexchart>
      <apexchart class="flex-1" ref="chartRef2" type="bar" :options="state.originChart.chartOptions"
        :series="state.originChart.series"></apexchart>
      <apexchart class="flex-1" ref="chartRef3" type="treemap" :options="state.tagChart.chartOptions"
        :series="state.tagChart.series"></apexchart>
    </div>
  </div>
</template>

<style scoped>
  .active-tab {
    background-color: #7d02eb;
    opacity: 0.7;
    color: white;
  }
</style>