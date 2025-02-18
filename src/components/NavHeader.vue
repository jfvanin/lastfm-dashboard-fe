<script setup lang="ts">
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import { faXmark } from '@fortawesome/free-solid-svg-icons';
  import { defineProps, defineEmits, ref, watch } from 'vue';

  const props = defineProps({
    user: String
  });

  const userInput = ref('');
  const loading = ref(false);

  const emit = defineEmits<{
    (event: 'setUser', user: string): void,
    (event: 'clearUser'): void
  }>();

  const updateUser = () => {
    loading.value = true;
    emit('setUser', userInput.value);
    userInput.value = '';
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