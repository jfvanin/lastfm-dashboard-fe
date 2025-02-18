<script setup lang="ts">
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import { loadUserLibrary, type DiscogsRelease } from '@/api/discogsApi';
  import { faAnglesDown, faAnglesUp, faCaretLeft, faCaretRight, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
  import { defineProps, defineEmits, ref, reactive, onMounted, watch, computed } from 'vue';
  import { scrobbleLastFM } from '@/api/lastFmApi';
  import { useToast } from 'vue-toast-notification';
  import 'vue-toast-notification/dist/theme-sugar.css';

  const lastFMKey = import.meta.env.VITE_LASTFM_API_KEY;
  const callBackUrl = import.meta.env.VITE_LASTFM_CALLBACK_URL;
  const authLoginUrl = `https://www.last.fm/api/auth/?api_key=${lastFMKey}&cb=${callBackUrl}`;

  const props = defineProps({
    user: String,
    lastfmAuth: String
  });

  const $toast = useToast();

  const userInput = ref('');
  const currentIndex = ref(0);
  const isExpanded = ref(true);
  const isLastFmLogged = ref(props.lastfmAuth && props.lastfmAuth.length > 1)

  const state = reactive({
    userLibrary: [] as DiscogsRelease[]
  });

  const emit = defineEmits<{
    (event: 'setUser', user: string): void,
    (event: 'clearUser'): void
  }>();

  const updateUser = () => {
    emit('setUser', userInput.value);
    userInput.value = '';
  };

  const fetchUserLibrary = async () => {
    const discogsUser = props.user;
    if (discogsUser) {
      try {
        const response = (await loadUserLibrary(String(discogsUser)));
        state.userLibrary = response;
      } catch (error) {
        $toast.error(`Error loading user library`);
        console.error('Error loading user library:', error);
      }
    }
  };

  const scrobbleAlbum = async (selected: number) => {
    if (!isLastFmLogged.value) {
      alert('You need to be logged in to LastFm to scrobble albums.');
      return;
    }

    const album = state.userLibrary.find((album) => album.id === selected);
    if (album) {
      const confirmScrobble = confirm(`Are you sure you want to scrobble the album "${album.basic_information.title}" by ${album.basic_information.artists.map(x => x.name).join(', ')}?`);

      if (confirmScrobble) {
        try {
          console.log(`Scrobbling album: ${album.basic_information.title}`);
          const result = await scrobbleLastFM(selected, album.basic_information.artists.map(x => x.name), album.basic_information.title);
          if (result.accepted > 0 && result.ignored === 0) {
            $toast.success(`${result.accepted} tracks scrobbled!`);
          } else if (result.accepted > 0 && result.ignored > 0) {
            $toast.warning(`${result.accepted} tracks scrobbled and ${result.ignored} ignored!`);
          } else {
            $toast.error(`${result.ignored} tracks ignored!`);
          }
        } catch (error) {
          $toast.error(`Error scrobbling album`);
          console.error('Error scrobbling album:', error);
        }
      }
    }
  }

  onMounted(async () => {
    if (props.user) {
      await fetchUserLibrary();
    } else {
      console.log('User is not set');
    }
  });

  watch(() => [props.user, props.lastfmAuth], () => {
    fetchUserLibrary();
    isLastFmLogged.value = props.lastfmAuth && props.lastfmAuth.length > 0;
  });

  const footerDisplay = computed(() => {
    return { height: isExpanded.value ? '192px' : '0px' };
  });

  const showPrev = () => {
    if (currentIndex.value > 5) {
      currentIndex.value = currentIndex.value - 5;
    } else {
      currentIndex.value = 0;
    }
  };

  const showNext = () => {
    if (currentIndex.value < state.userLibrary.length - 3) { // TODO vary according screen size
      currentIndex.value = currentIndex.value + 5;
    } else {
      currentIndex.value = 0;
    }
  };

  const toggle = () => {
    isExpanded.value = !isExpanded.value;
  };

</script> ds

<template>
  <footer>
    <button
      class="showButton right-0 bottom-0 -mt-5 mr-2 rounded bg-slate-950 w-8 h-8 z-10 transition-all duration-700 shadow-white shadow-xl hover:shadow-sm hover:text-white fixed"
      :class="isExpanded ? 'opacity-0' : ''" @click="toggle">
      <FontAwesomeIcon :icon="faAnglesUp" alt="Discogs" title="Discogs" />
    </button>
    <div :style="footerDisplay" class="fixed bottom-0 left-0 w-full h-48 bg-slate-950 transition-all duration-500">
      <div class="user-data flex h-7">
        <span class="flex-1 p-1">
          <img src="../assets/discogs.svg" alt="Discogs" class="inline-block h-5 text-white pl-1" />
        </span>
        <div v-if="props.user" class="float-right flex mr-12 w-auto">
          <div class="flex-1 w-54 mt-1 text-right pr-2">
            <span v-if="isLastFmLogged" class="font-bold text-green-500">
              Authenticated on LastFm!
              <FontAwesomeIcon :icon="faCheck" />
            </span>
            <span v-else class="font-bold text-red-600 hover:underline cursor-pointer hover:text-red-400">
              <a :href="authLoginUrl">Click to authenticate on LastFm</a>

            </span>
          </div>
          <div class="">
            <span class="float-right">
              <strong>Discogs User: </strong> {{ props.user }}
              <button @click="emit('clearUser')" class="text-lg text-white" alt="Clear user" title="Clear user">
                <FontAwesomeIcon :icon="faXmark" class="text-xs" />
              </button>
            </span>
          </div>
        </div>
        <div v-else class="float-right mr-12">
          <form @submit.prevent="updateUser">
            <strong>User: </strong>
            <input v-model="userInput" placeholder="Enter discogs username" class="w-44" />
            <button type="submit">
              <FontAwesomeIcon :icon="faCheck" class="pl-1" />
            </button>
          </form>
        </div>
      </div>
      <button class="hideButton absolute right-0 top-0 -mt-5 mr-2 rounded bg-slate-950 w-8 h-8" @click="toggle">
        <FontAwesomeIcon :icon="faAnglesDown" />
      </button>
      <div v-if="state.userLibrary.length" class="carousel relative w-max overflow-hidden pt-2">
        <div v-for="(release, index) in state.userLibrary" :key="release.id" @click="scrobbleAlbum(release.id)"
          class="carousel-item float-left transition-all duration-300 w-36 h-36 inline-block m-2 box-conten hover:-mt-0.5"
          :class="{ 'active': index === currentIndex }" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
          <img class="absolute w-full h-full" :src="release.basic_information.thumb" alt="Thumbnail" />
          <div class="absolute bottom-0 left-0 right-0 p-0.5 bg-white bg-opacity-50 text-xs text-black h-8 box-content">
            <strong>{{release.basic_information.artists.map(x => x.name).join(', ')}}</strong> -
            {{ release.basic_information.title }}
          </div>
        </div>
      </div>
      <button @click="showPrev"
        class="carousel-control-prev absolute top-0 bottom-0 left-0 flex items-center justify-center p-0 text-center border-0 hover:outline-none hover:no-underline focus:outline-none focus:no-underline hover:from-slate-600 w-14 mt-8 bg-gradient-to-r to-transparent from-slate-900 hover:text-white"
        type="button">
        <span class="inline-block bg-no-repeat" aria-hidden="true"></span>
        <span class="visually-hidden">
          <FontAwesomeIcon :icon="faCaretLeft" class="text-4xl" />
        </span>
      </button>
      <button @click="showNext"
        class="carousel-control-next absolute top-0 bottom-0 right-0 flex items-center justify-center p-0 text-center border-0 hover:outline-none hover:no-underline focus:outline-none focus:no-underline hover:to-slate-600 w-14 mt-8 bg-gradient-to-r from-transparent to-slate-900 hover:text-white"
        type="button">
        <span class="inline-block bg-no-repeat" aria-hidden="true"></span>
        <span class="visually-hidden">
          <FontAwesomeIcon :icon="faCaretRight" class="text-4xl" />
        </span>
      </button>
    </div>
  </footer>
</template>