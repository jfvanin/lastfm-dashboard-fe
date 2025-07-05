<template>
    <div class="m-6">
        <div class="float-right mr-8 mb-8">
            <label for="colorPalette" class="mr-3">Select Chart Color Palette:</label>
            <select id="colorPalette" class="bg-black text-gray-400 p-2 rounded border border-gray-700"
                :value="currentTheme" @change="$emit('updateTheme', ($event.target as HTMLSelectElement).value)">
                <option v-for="i in 10" :key="i" :value="'palette' + i">
                    Palette {{ i }}
                </option>
            </select>
        </div>
    </div>
</template>

<script setup lang="ts">
    defineProps<{
        currentTheme: string;
    }>();

    defineEmits<{
        updateTheme: [theme: string];
    }>();
</script>
