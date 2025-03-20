<script setup lang="ts">
    import { RouterView } from 'vue-router'
    import NavHeader from './components/NavHeader.vue'
    import NavDiscogs from './components/NavDiscogs.vue'
    import { reactive } from 'vue'
    import { loadUserDetails, setDiscogUserToLastfmUser, type UserDetails } from './api/api'

    const state = reactive({
        lastfmUser: localStorage.getItem('lastfm-user') || '',
        discogsUser: localStorage.getItem('discogs-user') || '',
        years: JSON.parse(localStorage.getItem('lastfm-years') || '[]') as number[],
        lastFMSession: localStorage.getItem('lastfm-session') || undefined,
        theme: localStorage.getItem('charts-theme') || 'palette10'
    });

    const handleSetLastfmUser = async (user: string) => {
        localStorage.setItem('lastfm-user', user);
        const userDetails: UserDetails = await loadUserDetails(user);
        state.lastfmUser = user;
        state.years = JSON.parse(userDetails.years).sort((a: number, b: number) => b - a) || [];
        localStorage.setItem('lastfm-years', JSON.stringify(state.years));
        if (userDetails.discoguser) {
            handleSetDiscogsUser(userDetails.discoguser);
        }
    }

    const handleRemoveLastfmUser = () => {
        localStorage.removeItem('lastfm-user');
        localStorage.removeItem('lastfm-years');
        localStorage.removeItem('lastfm-session');
        state.lastfmUser = '';
        state.years = [];
        state.lastFMSession = '';
        state.theme = '';
    }

    const handleSetDiscogsUser = (user: string) => {
        localStorage.setItem('discogs-user', user);
        setDiscogUserToLastfmUser(state.lastfmUser, user);
        state.discogsUser = user;
    }

    const handleRemoveDiscogsUser = () => {
        localStorage.removeItem('discogs-user');
        setDiscogUserToLastfmUser(state.lastfmUser, null);
        state.discogsUser = '';
    }

    const handleLastFmAuth = (sessionToken: string) => {
        localStorage.setItem('lastfm-session', sessionToken);
        state.lastFMSession = sessionToken;
    }

    const setTheme = (theme: string) => {
        localStorage.setItem('charts-theme', theme);
        state.theme = theme;
    }

</script>

<template>
    <NavHeader @setUser="handleSetLastfmUser" @clearUser="handleRemoveLastfmUser" :user="state.lastfmUser" />
    <RouterView v-slot="{ Component, route }">
        <component :is="Component" :lastfmUser="state.lastfmUser" :years="state.years" :theme="state.theme"
            @handleLastFmAuth="handleLastFmAuth" @setTheme="setTheme" v-bind="route.params" />
    </RouterView>
    <NavDiscogs @setUser="handleSetDiscogsUser" @clearUser="handleRemoveDiscogsUser" :user="state.discogsUser"
        :lastfmAuth="state.lastFMSession" />
</template>