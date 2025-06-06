<script setup lang="ts">
  import { reactive, onMounted, ref, watch, defineProps } from 'vue';
  import { loadDecadeStatistics, loadGeneralStatistics, loadOriginStatistics, loadTagStatistics, setYearsToUser, type Top5Statistics } from '@/api/api';
  import ApexCharts from 'apexcharts';
  import { VueSpinnerPie } from 'vue3-spinners';
  import { getTopAlbums, getTopArtist, getTopTracks, type TopAlbumsResponse, type TopArtistsResponse, type TopTracksResponse } from '@/api/lastFmApi';

  const chartFullDecadeRef = ref<ApexCharts | null>(null);
  const chartFullOriginRef = ref<ApexCharts | null>(null);
  const chartFullTagsRef = ref<ApexCharts | null>(null);

  const chartRef = ref<ApexCharts | null>(null);
  const chartRef2 = ref<ApexCharts | null>(null);
  const chartRef3 = ref<ApexCharts | null>(null);

  const props = defineProps({
    user: String,
    years: Array<number>,
    theme: String,
  });

  const emit = defineEmits<{
    (event: 'setTheme', theme: string): void,
  }>();

  const state = reactive({
    years: [2024], // Example years array
    selectedYear: -1,
    loading: false,
    topArtists: {} as TopArtistsResponse,
    topAlbums: {} as TopAlbumsResponse,
    topTracks: {} as TopTracksResponse,
    listTop5: {} as Top5Statistics,
    fullDecadesChart: {
      series: [{
        name: '',
        data: [] as number[],
      }],
      chartOptions: {
        labels: [],
        theme: {
          palette: props.theme || 'palette10'
        },
        tooltip: {
          theme: 'dark',
        },
        title: {
          text: 'Albums\' Decades',
          align: 'center',
          style: {
            color: '#f0f0f0',
            fontSize: '18px'
          }
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
          palette: props.theme || 'palette10'
        },
        title: {
          text: 'Artits\' Country of Origin',
          align: 'center',
          style: {
            color: '#f0f0f0',
            fontSize: '18px'
          }
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
    }, fullTagsChart: {
      series: [{
        name: '',
        data: [] as number[],
      }],
      chartOptions: {
        labels: [],
        theme: {
          palette: props.theme || 'palette10'
        },
        title: {
          text: 'Top 10 Main Tags by Year',
          align: 'center',
          style: {
            color: '#f0f0f0',
            fontSize: '18px'
          }
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
          palette: props.theme || 'palette10'
        },
        title: {
          text: 'Artists\' Country of Origin',
          align: 'center',
          style: {
            color: '#f0f0f0',
            fontSize: '18px'
          }
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
          palette: props.theme || 'palette10'
        },
        title: {
          text: 'Albums\' Decades',
          align: 'center',
          style: {
            color: '#f0f0f0',
            fontSize: '18px'
          }
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
          align: 'center',
          style: {
            color: '#f0f0f0',
            fontSize: '18px'
          }
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

  const updatePalette = (event: Event) => {
    const selectedPalette = (event.target as HTMLSelectElement).value;
    emit('setTheme', selectedPalette);

    state.fullDecadesChart.chartOptions.theme.palette = selectedPalette;
    state.fullOriginChart.chartOptions.theme.palette = selectedPalette;
    state.fullTagsChart.chartOptions.theme.palette = selectedPalette;
    state.decadesChart.chartOptions.theme.palette = selectedPalette;
    state.originChart.chartOptions.theme.palette = selectedPalette;
    state.tagChart.chartOptions.theme.palette = selectedPalette;

    if (chartFullDecadeRef.value) {
      chartFullDecadeRef.value.updateOptions(state.fullDecadesChart.chartOptions);
    }
    if (chartFullOriginRef.value) {
      chartFullOriginRef.value.updateOptions(state.fullOriginChart.chartOptions);
    }
    if (chartFullTagsRef.value) {
      chartFullTagsRef.value.updateOptions(state.fullTagsChart.chartOptions);
    }
    if (chartRef.value) {
      chartRef.value.updateOptions(state.decadesChart.chartOptions);
    }
    if (chartRef2.value) {
      chartRef2.value.updateOptions(state.originChart.chartOptions);
    }
    if (chartRef3.value) {
      chartRef3.value.updateOptions(state.tagChart.chartOptions);
    }
  };

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
          decadesData['1960s'] = [...decadesData['1950s']];
          decadesData['1970s'] = [...decadesData['1950s']];
          decadesData['1980s'] = [...decadesData['1950s']];
          decadesData['1990s'] = [...decadesData['1950s']];
          decadesData['2000s'] = [...decadesData['1950s']];

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
          state.decadesChart.chartOptions.xaxis.categories = response.map((x: { _id: string, count: number }) => x._id);
          state.decadesChart.series[0].data = response.map((x: { _id: string, count: number }) => x.count);
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
        if (state.selectedYear === -1) {
          state.fullTagsChart.chartOptions.xaxis.categories = response.map((x: { _id: string }) => x._id);
          const tagsData: { [key: string]: number[] } = {};

          response.forEach((yearData: { _id: string, tags: { tag: string, count: number }[] }, index: number) => {
            yearData.tags.forEach((tag: { tag: string, count: number }) => {
              if (!tagsData[tag.tag]) {
                tagsData[tag.tag] = Array(state.fullOriginChart.chartOptions.xaxis.categories.length).fill(0);
              }
              tagsData[tag.tag][index] = tag.count;
            });
          });

          state.fullTagsChart.series = Object.keys(tagsData).map(tag => ({
            name: tag,
            data: tagsData[tag]
          }));
        } else {
          state.tagChart.series[0].data = response.map((x: { _id: string, count: number }) => ({ x: x._id, y: x.count }));
        }
      } catch (error) {
        console.error('Error loading tag statistics:', error);
      }

      state.loading = false;
    }
  };

  const fetchGeneralStatistics = async () => {
    const lastfmUser = props.user;
    if (lastfmUser && state.selectedYear > 0) {
      state.listTop5 = {} as Top5Statistics;
      state.loading = true;
      try {
        state.listTop5 = await loadGeneralStatistics(String(lastfmUser), state.selectedYear);
      } catch (error) {
        console.error('Error loading general statistics:', error);
      }

      state.loading = false;
    }
  };


  const fetchLastFmData = async () => {
    const lastfmUser = props.user;
    if (lastfmUser && state.selectedYear === -1) {
      try {
        state.topArtists = (await getTopArtist(String(lastfmUser)));
        state.topAlbums = (await getTopAlbums(String(lastfmUser)));
        state.topTracks = (await getTopTracks(String(lastfmUser)));
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
      fetchGeneralStatistics();
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

  watch(() => [
    state.fullTagsChart.series,
    state.fullTagsChart.chartOptions.xaxis.categories,
  ], () => {
    if (chartFullTagsRef.value) {
      chartFullTagsRef.value.updateOptions(state.fullTagsChart.chartOptions);
      chartFullTagsRef.value.updateSeries(state.fullTagsChart.series);
    }
  });

  watch(() => [props.user, state.selectedYear], () => {
    fetchDecadeStatistics();
    fetchOriginStatistics();
    fetchTagStatistics();
    fetchLastFmData();
    fetchGeneralStatistics();
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
      <button v-for="year in state.years" class="px-4 py-2 min-w-3" :key="year" @click="state.selectedYear = year"
        :class="{ 'active-tab': state.selectedYear === year }">
        <span
          class="lg:text-base lg:rotate-0 text-xs rotate-90 inline-block transform origin-center transition-all duration-200">
          {{ year }}
        </span>
      </button>
      <button class="px-4 py-2 min-w-3 break-all" @click="addYear">
        <strong>+</strong>
      </button>
    </div>
    <div v-if="state.loading" class="text-center">
      <VueSpinnerPie size="40" color="grey" class="text-center m-auto mb-3 mt-24" />
      <p>Fetching data...</p>
    </div>
    <div v-else-if="state.selectedYear === -1" class="ml-3 mr-4">
      <apexchart height="350" ref="chartFullDecadeRef" type="bar" :options="state.fullDecadesChart.chartOptions"
        :series="state.fullDecadesChart.series"></apexchart>
      <apexchart height="350" ref="chartFullOriginRef" type="bar" :options="state.fullOriginChart.chartOptions"
        :series="state.fullOriginChart.series"></apexchart>
      <apexchart height="350" ref="chartFullTagsRef" type="bar" :options="state.fullTagsChart.chartOptions"
        :series="state.fullTagsChart.series"></apexchart>
      <div v-if="state.topTracks.toptracks" class="mx-6 mb-6">
        <span class="text-xl">Top Albums</span>
        <ul class="flex flex-wrap my-2">
          <li v-for="album in state.topAlbums.topalbums.album" :key="album.name"
            class="flex-1 relative min-w-18 basis-24 max-w-44">
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
            class="flex-1 relative min-w-18 basis-24 max-w-44">
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
    <div v-else>
      <div class="flex flex-wrap ml-3 mr-4">
        <apexchart class="flex-1 min-w-80" ref="chartRef" type="bar" :options="state.decadesChart.chartOptions"
          :series="state.decadesChart.series"></apexchart>
        <apexchart class="flex-1 min-w-80" ref="chartRef2" type="bar" :options="state.originChart.chartOptions"
          :series="state.originChart.series"></apexchart>
        <apexchart class="flex-1 min-w-80" ref="chartRef3" type="treemap" :options="state.tagChart.chartOptions"
          :series="state.tagChart.series"></apexchart>
      </div>
      <div id="topList" class="flex flex-col m-6 ml-3 mr-4">
        <h2 class="text-2xl font-bold text-white mb-4">Top 5 Days with Most Scrobbles from Same Artist</h2>
        <ul class="flex flex-wrap gap-4">
          <li v-for="day in state.listTop5.top5ScrobbleDays"
            :key="`${day._id.year}-${day._id.month}-${day._id.day}-${day._id.artist.mbid}`"
            class="bg-gray-800 text-white p-4 rounded-lg shadow-md flex-1 min-w-28">
            <div class="text-lg font-semibold">{{ day._id.artist['#text'] }}</div>
            <div class="text-sm">{{ day._id.day }}/{{ day._id.month }}/{{ day._id.year }}</div>
            <div class="text-sm">{{ day.count }} scrobbles</div>
          </li>
        </ul>
      </div>
      <div id="topList" class="flex flex-wrap gap-6 m-6 ml-3 mr-4">
        <div class="flex-1 bg-gray-800 text-white p-6 rounded-lg shadow-md">
          <h2 class="text-2xl font-bold mb-4">Top 5 Artists</h2>
          <ul class="space-y-2">
            <li v-for="artist in state.listTop5.top5MostScrobbleArtists" :key="artist.artist.mbid"
              class="flex justify-between items-center p-2 bg-gray-700 rounded">
              <span>{{ artist.artist['#text'] }}</span>
              <span class="text-sm text-gray-400">{{ artist.count }} scrobbles</span>
            </li>
          </ul>
        </div>
        <div class="flex-1 bg-gray-800 text-white p-6 rounded-lg shadow-md">
          <h2 class="text-2xl font-bold mb-4">Top 5 Albums</h2>
          <ul class="space-y-2">
            <li v-for="album in state.listTop5.top5MostScrobbleAlbums" :key="album.album.mbid"
              class="flex justify-between items-center p-2 bg-gray-700 rounded">
              <span>{{ album.album['#text'] }}</span>
              <span class="text-sm text-gray-400">{{ album.count }} scrobbles</span>
            </li>
          </ul>
        </div>
        <div class="flex-1 bg-gray-800 text-white p-6 rounded-lg shadow-md">
          <h2 class="text-2xl font-bold mb-4">Top 5 Tracks</h2>
          <ul class="space-y-2">
            <li v-for="track in state.listTop5.top5MostScrobbleTracks" :key="track.name"
              class="flex justify-between items-center p-2 bg-gray-700 rounded">
              <span>{{ track.name }}</span>
              <span class="text-sm text-gray-400">{{ track.count }} scrobbles</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="m-6">
      <div class="float-right mr-8 mb-8">
        <label for="colorPalette" class="mr-3">Select Chart Color Palette:</label>
        <select id="colorPalette" class="bg-black text-gray-400 p-2 rounded border border-gray-700"
          @change="updatePalette($event)" :value="props.theme">
          <option v-for="i in 10" :key="i" :value="'palette' + i">Palette {{ i }}</option>
        </select>
      </div>
    </div>
  </div>
</template>