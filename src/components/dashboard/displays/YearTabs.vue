<template>
    <div class="tabs flex gap-3 mb-5">
        <button class="px-4 py-2 min-w-10 text-center" :class="{ 'active-tab': selectedYear === -1 }"
            @click="$emit('selectYear', -1)">
            All years
        </button>
        <button v-for="year in years" :key="year" class="px-4 py-2 min-w-3"
            :class="{ 'active-tab': selectedYear === year }" @click="$emit('selectYear', year)">
            <span
                class="lg:text-base lg:rotate-0 text-xs rotate-90 inline-block transform origin-center transition-all duration-200">
                {{ year }}
            </span>
        </button>
        <button class="px-4 py-2 min-w-3 break-all" @click="$emit('addYear')">
            <strong>+</strong>
        </button>
    </div>
</template>

<script setup lang="ts">
    defineProps<{
        selectedYear: number;
        years: number[];
    }>();

    defineEmits<{
        selectYear: [year: number];
        addYear: [];
    }>();
</script>
