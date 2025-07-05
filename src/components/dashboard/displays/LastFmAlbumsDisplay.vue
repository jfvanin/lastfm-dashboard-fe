<template>
    <div v-if="topTracks.toptracks" class="mx-6 mb-6">
        <span class="text-xl">Top Albums</span>
        <ul class="flex flex-wrap my-2 justify-center lg:justify-start">
            <li v-for="album in topAlbums.topalbums.album" :key="album.name"
                class="relative min-w-24 w-24 lg:flex-1 lg:basis-24 lg:max-w-44 m-0">
                <img :src="album.image[3]['#text']" alt="album"
                    class="album-thumb w-full border-l-2 border-slate-950" />
                <div class="h-14 absolute -mt-14 block w-full bg-gradient-to-t to-transparent from-black">
                    <span
                        class="text-xs font-bold mt-4 text-white ml-1 w-full overflow-hidden text-ellipsis whitespace-nowrap block">
                        {{ album.name }}
                    </span>
                    <span class="text-xs text-white ml-1 block">{{ album.playcount }} plays</span>
                </div>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
    import type { TopAlbumsResponse, TopTracksResponse } from '@/api/lastFmApi';

    defineProps<{
        topAlbums: TopAlbumsResponse;
        topTracks: TopTracksResponse;
    }>();
</script>
