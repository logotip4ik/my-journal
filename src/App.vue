<template>
  <div :class="{ main: true, 'main--dark': darkMode, 'main--sharing-task': showingShare }">
    <Navbar />
    <TaskOverlay />
    <TaskGrid />
    <TaskShareOverlay />
    <div class="button-container">
      <button
        :class="{ main__button: true, 'main__button--dark': darkMode }"
        @click="toggleDarkMode"
      >
        <transition name="fade">
          <img
            v-if="!darkMode"
            src="@/assets/dark_mode-black-18dp.svg"
            alt="dark mode icon"
            class="main__button__icon"
          />
          <img
            v-else
            src="@/assets/light_mode-white-18dp.svg"
            alt="light mode icon"
            class="main__button__icon"
          />
        </transition>
      </button>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line
import { onMounted, provide, reactive, ref } from 'vue';
import { useDark, useToggle } from '@vueuse/core';
import { DateTime } from 'luxon';
import { v4 } from 'uuid';

import useDB from './hooks/useDB';

import Navbar from './components/Navbar.vue';
import TaskOverlay from './components/TaskOverlay.vue';
import TaskGrid from './components/TaskGrid.vue';
import TaskShareOverlay from './components/TaskShareOverlay.vue';

export default {
  name: 'App',
  setup() {
    const db = useDB('journal-store', 2);
    const tasks = ref([]);
    const darkMode = useDark();
    const toggleDarkMode = useToggle(darkMode);
    const creatingTask = ref(false);
    const showingShare = ref(false);
    const sharingTask = ref(null);
    const newTask = reactive({
      className: '',
      task: '',
      finishDate: DateTime.local()
        .plus({ days: 1 })
        .toISODate(),
    });

    function resetNewTask() {
      creatingTask.value = false;
      newTask.className = '';
      newTask.task = '';
      newTask.finishDate = DateTime.local()
        .plus({ days: 1 })
        .toISODate();
    }
    function resetShare() {
      showingShare.value = false;
      sharingTask.value = null;
    }

    async function addNewTask() {
      if (!newTask.className || !newTask.task || !newTask.finishDate) return;
      const task = { ...newTask, id: v4(), createdDate: DateTime.local().toISO() };
      await db.homework.put(task);
      resetNewTask();
      tasks.value.push(task);
    }

    function shareTask(task) {
      sharingTask.value = task;
      showingShare.value = true;
    }
    async function deleteTask(taskId) {
      tasks.value = tasks.value.filter(({ id }) => id !== taskId);
      await db.homework.delete(taskId);
    }

    async function checkForSharedTask() {
      const params = new URLSearchParams(window.location.search);
      if (params.has('shared_task')) {
        const sharedTask = JSON.parse(decodeURI(atob(params.get('shared_task'))));
        await db.homework.put({ ...sharedTask, id: v4() });
        const url = window.location.href.split('?')[0];
        window.history.pushState('', '', url);
      }
      tasks.value = await db.homework.toArray();
    }

    onMounted(() => {
      checkForSharedTask();
    });

    provide('db', db);
    provide('tasks', tasks);
    provide('darkMode', darkMode);
    provide('creatingTask', creatingTask);
    provide('showingShare', showingShare);
    provide('sharingTask', sharingTask);
    provide('newTask', newTask);
    provide('resetNewTask', resetNewTask);
    provide('resetShare', resetShare);
    provide('addNewTask', addNewTask);
    provide('deleteTask', deleteTask);
    provide('shareTask', shareTask);

    return {
      darkMode,
      toggleDarkMode,
      showingShare,
    };
  },
  components: {
    Navbar,
    TaskGrid,
    TaskOverlay,
    TaskShareOverlay,
  },
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600&display=swap');
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: 'Nunito', sans-serif;
  overflow-x: hidden;
  min-height: 100vh;
}
#app {
  min-height: 100vh;
}
.main {
  padding-top: 56px;
  min-height: 100vh;
  transition: background-color 400ms ease-out, color 400ms ease-out;
  padding-bottom: 0.5rem;

  &--dark {
    color: white;
    background-color: #1f2022;
  }
  &--sharing-task {
    overflow-y: hidden;
  }

  .button-container {
    position: fixed;
    bottom: 3rem;
    right: 1.5rem;
  }

  &__button {
    position: relative;
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
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 400ms ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
