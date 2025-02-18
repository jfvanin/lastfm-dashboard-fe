<script setup lang="ts">
    import { defineProps } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import DashboardComponent from '../components/DashboardComponent.vue'
    import { getLastFMSession } from '@/api/lastFmApi';

    const props = defineProps({
        lastfmUser: String,
        years: Array<number>,
    });

    const emit = defineEmits<{
        (event: 'handleLastFmAuth', sessionToken: string): void,
    }>();

    // LastFM Auth procedure
    const route = useRoute();
    const authToken = route.query.token;
    if (authToken) {
        getLastFMSession(String(authToken)).then((token) => {
            emit('handleLastFmAuth', token);
        });
        const router = useRouter();
        router.push('/');
    }

</script>

<template>
    <main>
        <DashboardComponent :user="props.lastfmUser" :years="props.years" />
    </main>
</template>
