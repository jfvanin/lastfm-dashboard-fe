<script setup lang="ts">
  import { onMounted, watch, defineProps, defineEmits, ref } from 'vue';
  import { VueSpinnerPie } from 'vue3-spinners';

  // Components
  import YearTabs from './dashboard/displays/YearTabs.vue';
  import FullYearCharts from './dashboard/charts/FullYearCharts.vue';
  import SingleYearCharts from './dashboard/charts/SingleYearCharts.vue';
  import ThemeSelector from './dashboard/displays/ThemeSelector.vue';

  // Composables
  import { useChartConfiguration } from './dashboard/composables/useChartConfiguration';
  import { useChartData } from './dashboard/composables/useChartData';
  import { useYearManagement } from './dashboard/composables/useYearManagement';

  const props = defineProps<{
    user?: string;
    years?: number[];
    theme?: string;
  }>();

  const emit = defineEmits<{
    setTheme: [theme: string];
  }>();

  // Initialize composables
  const currentTheme = ref(props.theme || 'palette10');
  const {
    fullDecadesChart,
    fullOriginChart,
    fullTagsChart,
    decadesChart,
    originChart,
    tagChart,
    updateTheme
  } = useChartConfiguration(currentTheme.value);

  const {
    loading,
    data,
    fetchAllData
  } = useChartData();

  const {
    selectedYear,
    years,
    addYear,
    setYears,
    selectYear
  } = useYearManagement(props.years || [2024]);

  // Chart configurations object for data fetching
  const chartConfigs = {
    fullDecadesChart,
    fullOriginChart,
    fullTagsChart,
    decadesChart,
    originChart,
    tagChart
  };

  // Event handlers
  const handleThemeUpdate = (theme: string) => {
    emit('setTheme', theme);
    currentTheme.value = theme;
    updateTheme(theme);
  };

  const handleYearSelect = (year: number) => {
    selectYear(year);
  };

  const handleAddYear = () => {
    if (props.user) {
      addYear(props.user);
    }
  };

  // Data fetching watchers
  watch(() => [props.user, selectedYear.value], () => {
    if (props.user) {
      fetchAllData(props.user, selectedYear.value, chartConfigs);
    }
  });

  watch(() => props.years, () => {
    if (props.years) {
      setYears(props.years);
    }
  });

  watch(() => props.theme, (newTheme) => {
    if (newTheme) {
      currentTheme.value = newTheme;
      updateTheme(newTheme);
    }
  });

  // Lifecycle
  onMounted(async () => {
    if (props.years) {
      setYears(props.years);
    }
    if (props.user) {
      await fetchAllData(props.user, selectedYear.value, chartConfigs);
    } else {
      console.log('User is not set');
    }
  });
</script>

<template>
  <div>
    <YearTabs :selected-year="selectedYear" :years="years" @select-year="handleYearSelect" @add-year="handleAddYear" />

    <div v-if="loading" class="text-center">
      <VueSpinnerPie size="40" color="grey" class="text-center m-auto mb-3 mt-24" />
      <p>Fetching data...</p>
    </div>

    <FullYearCharts v-else-if="selectedYear === -1" ref="fullYearChartsRef" :full-decades-chart="fullDecadesChart"
      :full-origin-chart="fullOriginChart" :full-tags-chart="fullTagsChart" :top-albums="data.topAlbums"
      :top-tracks="data.topTracks" />

    <SingleYearCharts v-else ref="singleYearChartsRef" :decades-chart="decadesChart" :origin-chart="originChart"
      :tag-chart="tagChart" :list-top5="data.listTop5" />

    <ThemeSelector :current-theme="currentTheme" @update-theme="handleThemeUpdate" />
  </div>
</template>
