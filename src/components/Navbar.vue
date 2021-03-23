<template>
  <nav :class="{ navbar: true, 'navbar--dark': darkMode }">
    <div class="navbar__heading">
      <transition-group name="toggle-right">
        <button
          v-if="creatingTask"
          class="navbar__button navbar__button--close"
          @click="resetNewTask"
          key="1"
        ></button>
        <h1 v-if="!creatingTask" class="navbar__heading__logo" key="2">Journal</h1>
        <h1 v-else class="navbar__heading__logo navbar__heading__logo--left-3" key="3">Add Task</h1>
      </transition-group>
    </div>
    <transition name="toggle-left">
      <button
        v-if="!creatingTask"
        class="navbar__button navbar__button--add"
        @click="creatingTask = !creatingTask"
      ></button>
      <button v-else class="navbar__button navbar__button--save" @click="addNewTask"></button>
    </transition>
  </nav>
</template>

<script>
import { inject } from 'vue';

export default {
  setup() {
    const darkMode = inject('darkMode');
    const creatingTask = inject('creatingTask');
    const resetNewTask = inject('resetNewTask');
    const addNewTask = inject('addNewTask');

    return {
      darkMode,
      creatingTask,
      resetNewTask,
      addNewTask,
    };
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  // THIS SHOULD BE CONSTANT
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9999;
  height: 56px;
  width: 100%;
  padding: 0.75rem 1.25rem;
  background-color: #eef0f2;
  box-shadow: 0px 5px 10px 0px rgba($color: #000000, $alpha: 0.25);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 400ms ease-out, color 400ms ease-out;

  &--dark {
    color: #fafafa;
    background-color: #1f2022;
    // background-color: #393d3f;

    .navbar__button::after,
    ::before {
      background-color: white !important;
    }
  }

  &__heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    &__logo {
      padding-left: 0.5rem;
      transition: transform 300ms ease;
      font-size: 1.7rem;

      &--left-3 {
        left: 3.125rem;
      }
    }
  }

  &__button {
    $button-size: 30px;
    $plus-size: 3px;
    appearance: none;
    border: none;
    outline: none;
    height: $button-size;
    width: $button-size;
    background: transparent;
    position: relative;
    cursor: pointer;

    &::after,
    &::before {
      content: '';
      position: absolute;
      background-color: black;
      transform: translate(-50%, -50%);
      border-radius: 0.25rem;
      transition: background-color 400ms ease-out;
    }
    &--add {
      position: absolute;
      top: 28px;
      right: 1rem;
      transform: translateY(-50%);
      &::after {
        width: 100%;
        height: $plus-size;
      }
      &::before {
        height: 100%;
        width: $plus-size;
      }
    }
    &--close {
      &::after,
      &::before {
        width: 100%;
        height: $plus-size;
      }
      &::after {
        transform: translateX(-50%) rotate(45deg);
      }
      &::before {
        transform: translateX(-50%) rotate(-45deg);
      }
    }
    &--save {
      position: absolute;
      top: 28px;
      right: 1rem;
      transform: translateY(-50%);
      &::before {
        width: 50%;
        height: 3px;
        transform: translate(-100%, 100%) rotate(45deg);
      }
      &::after {
        width: 100%;
        height: 3px;
        transform: translate(-28%, -80%) rotate(-45deg);
      }
    }
  }
}

.toggle-left-enter-active,
.toggle-left-leave-active {
  transition: transform 300ms ease, opacity 300ms ease;
}

.toggle-left-enter-from,
.toggle-left-leave-to {
  opacity: 0;
  transform: translate(30px, -50%);
}
.toggle-right-enter-active,
.toggle-right-leave-active {
  transition: opacity 300ms ease, transform 200ms ease;
  position: absolute;
}
.toggle-right-enter-from,
.toggle-right-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
