<template>
    <div>
        <div id="topList" class="flex flex-col m-6 ml-3 mr-4">
            <h2 class="text-2xl font-bold text-white mb-4">Top 5 Days with Most Scrobbles from Same Artist</h2>
            <ul class="flex flex-wrap gap-4">
                <li v-for="day in listTop5.top5ScrobbleDays"
                    :key="`${day._id.year}-${day._id.month}-${day._id.day}-${day._id.artist.mbid}`"
                    class="bg-gray-800 text-white p-4 rounded-lg shadow-md flex-1 min-w-28">
                    <div class="text-lg font-semibold">{{ day._id.artist['#text'] }}</div>
                    <div class="text-sm">{{ day._id.day }}/{{ day._id.month }}/{{ day._id.year }}</div>
                    <div class="text-sm">{{ day.count }} scrobbles</div>
                </li>
            </ul>
        </div>

        <div id="topList" class="flex flex-wrap gap-6 m-6 ml-3 mr-4">
            <div class="flex-1 bg-gray-800 text-white p-4 rounded-lg shadow-md">
                <h2 class="text-2xl font-bold mb-4">Top 5 Artists</h2>
                <ul class="space-y-2">
                    <li v-for="artist in listTop5.top5MostScrobbleArtists" :key="artist.artist.mbid"
                        class="flex justify-between items-center p-2 bg-gray-700 rounded">
                        <span>{{ artist.artist['#text'] }}</span>
                        <span class="text-sm text-gray-400 text-right min-w-[100px]">{{ artist.count }} scrobbles</span>
                    </li>
                </ul>
            </div>

            <div class="flex-1 bg-gray-800 text-white p-4 rounded-lg shadow-md">
                <h2 class="text-2xl font-bold mb-4">Top 5 Albums</h2>
                <ul class="space-y-2">
                    <li v-for="album in listTop5.top5MostScrobbleAlbums" :key="album.album.mbid"
                        class="flex justify-between items-center p-2 bg-gray-700 rounded">
                        <span>{{ album.album['#text'] }}</span>
                        <span class="text-sm text-gray-400 text-right min-w-[100px]">{{ album.count }} scrobbles</span>
                    </li>
                </ul>
            </div>

            <div class="flex-1 bg-gray-800 text-white p-4 rounded-lg shadow-md">
                <h2 class="text-2xl font-bold mb-4">Top 5 Tracks</h2>
                <ul class="space-y-2">
                    <li v-for="track in listTop5.top5MostScrobbleTracks" :key="track.name"
                        class="flex justify-between items-center p-2 bg-gray-700 rounded">
                        <span>{{ track.name }}</span>
                        <span class="text-sm text-gray-400 text-right min-w-[100px]">{{ track.count }} scrobbles</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { Top5Statistics } from '@/api/api';

    defineProps<{
        listTop5: Top5Statistics;
    }>();
</script>
