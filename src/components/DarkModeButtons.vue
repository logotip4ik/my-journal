<template>
  <transition name="toggle-buttons">
    <button
      v-if="!darkMode"
      :class="{ button: true, 'button--dark': darkMode }"
      @click="toggleDarkMode"
    >
      <img src="@/assets/dark_mode-black-18dp.svg" alt="dark mode icon" class="button__icon" />
    </button>
    <button :class="{ button: true, 'button--dark': darkMode }" @click="toggleDarkMode" v-else>
      <img src="@/assets/light_mode-white-18dp.svg" alt="light mode icon" class="button__icon" />
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

<style lang="scss" scoped>
.button {
  position: fixed;
  z-index: 999;
  bottom: 3rem;
  right: 1.5rem;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 1px solid #999;
  background-color: white;
  box-shadow: 0 0 10px 0 rgba($color: #000000, $alpha: 0.2),
    inset 0 0 5px 0 rgba($color: #000000, $alpha: 0.1);
  transition: background-color 400ms ease-out;

  &--dark {
    background-color: #1f2022;
  }

  &__icon {
    width: 35px;
    height: 35px;
  }
}
</style>
