<script setup lang="ts">
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import { faXmark, faExpand, faCompress } from '@fortawesome/free-solid-svg-icons';
  import { faGithub } from '@fortawesome/free-brands-svg-icons';
  import { defineProps, defineEmits, ref, watch } from 'vue';

  const props = defineProps({
    user: String
  });

  const userInput = ref('');
  const loading = ref(false);
  const isFullscreen = ref(false);

  const emit = defineEmits<{
    (event: 'setUser', user: string): void,
    (event: 'clearUser'): void
  }>();

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        isFullscreen.value = true;
      }).catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          isFullscreen.value = false;
        }).catch(err => {
          console.error(`Error attempting to exit fullscreen: ${err.message}`);
        });
      }
    }
  };

  const updateUser = () => {
    if (userInput.value) {
      loading.value = true;
      emit('setUser', userInput.value);
      userInput.value = '';
    }
  };

  watch(() => [props.user], () => {
    if (props.user && loading.value) {
      loading.value = false;
    }
  });

</script>

<template>
  <header
    class="shadow-md shadow-stone-600 flex justify-between items-center h-14 bg-gradient-to-l from-transparent to-red-950">
    <span class="wrapper flex-1 font-sans text-xl ml-3">
      <strong>LastFm</strong> Mene Dashboard
    </span>
    <div class="float-right mr-3 mt-1 flex items-center gap-4">
      <button @click="toggleFullscreen" class="text-white"
        :title="isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'">
        <FontAwesomeIcon :icon="isFullscreen ? faCompress : faExpand" class="text-xl" />
      </button>
      <a href="https://github.com/jfvanin/lastfm-dashboard-fe" target="_blank" class="text-white" alt="GitHub"
        title="GitHub">
        <FontAwesomeIcon :icon="faGithub" class="text-2xl" />
      </a>
    </div>
    <div class="user-data float-right">
      <div v-if="loading === true" class="mr-8">
        <span>Setting user...</span>
      </div>
      <div v-else-if="props.user" class="mr-8">
        User {{ props.user }}
        <button @click="emit('clearUser')" class="text-lg text-white" alt="Clear user" title="Clear user">
          <FontAwesomeIcon :icon="faXmark" class="text-xs" />
        </button>
      </div>
      <div v-else class="mr-8">
        <form @submit.prevent="updateUser">
          <input v-model="userInput" placeholder="Enter Username" class="w-32" />
          <button type="submit" class="pl-1">Set LastFM User</button>
        </form>
      </div>
    </div>
  </header>
</template>