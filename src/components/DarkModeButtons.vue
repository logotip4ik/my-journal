<template>
  <transition name="toggle-buttons">
    <button
      v-if="!darkMode"
      :class="{ main__button: true, 'main__button--dark': darkMode }"
      @click="toggleDarkMode"
    >
      <img
        src="@/assets/dark_mode-black-18dp.svg"
        alt="dark mode icon"
        class="main__button__icon"
      />
    </button>
    <button
      :class="{ main__button: true, 'main__button--dark': darkMode }"
      @click="toggleDarkMode"
      v-else
    >
      <img
        src="@/assets/light_mode-white-18dp.svg"
        alt="light mode icon"
        class="main__button__icon"
      />
    </button>
  </transition>
</template>

<script>
import { inject } from 'vue';

export default {
  setup() {
    const darkMode = inject('darkMode');
    const toggleDarkMode = inject('toggleDarkMode');

    return {
      darkMode,
      toggleDarkMode,
    };
  },
};
</script>

<style></style>
