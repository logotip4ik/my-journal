<template>
  <div :class="{ main: true, 'main--dark': darkMode, 'main--lock-y': showingShare || showingEdit }">
    <Navbar />
    <TaskGrid />
    <DarkModeButtons />
    <OverlayEdit />
    <OverlayShare />
    <OverlayCreateTask />
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
import DarkModeButtons from './components/DarkModeButtons.vue';
import TaskGrid from './components/TaskGrid.vue';
import OverlayEdit from './components/Overlay-Edit.vue';
import OverlayShare from './components/Overlay-Share.vue';
import OverlayCreateTask from './components/Overlay-CreateTask.vue';

export default {
  name: 'App',
  setup() {
    const db = useDB('journal-store', 2);
    const tasks = ref([]);
    const darkMode = useDark();
    const toggleDarkMode = useToggle(darkMode);
    const creatingTask = ref(false);
    const showingShare = ref(false);
    const showingEdit = ref(false);
    const sharingTask = ref(null);
    const editingTask = ref(null);
    const newTask = reactive({
      className: '',
      task: '',
      photo: null,
      finishDate: DateTime.local()
        .plus({ days: 1 })
        .toISODate(),
    });

    async function getAllTasks() {
      const params = new URLSearchParams(window.location.search);
      if (params.has('shared_task')) {
        const sharedTask = JSON.parse(decodeURI(atob(params.get('shared_task'))));
        await db.homework.put({ ...sharedTask, id: v4() });
        const url = window.location.href.split('?')[0];
        window.history.pushState('', '', url);
      }
      tasks.value = await db.homework.toArray();
    }

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
    function resetEdit() {
      showingEdit.value = false;
      editingTask.value = null;
    }

    async function addNewTask() {
      if (!newTask.className || !newTask.task || !newTask.finishDate) return;
      const task = {
        ...newTask,
        id: v4(),
        createdDate: DateTime.local().toISO(),
        updatedDate: DateTime.local().toISO(),
      };
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
    function editTask(task) {
      editingTask.value = task;
      showingEdit.value = true;
    }
    async function saveEditingTask() {
      if (!editingTask.value.className || !editingTask.value.task) return;
      await db.homework.put(
        { ...editingTask.value, updatedDate: DateTime.local().toISO() },
        editingTask.value.id,
      );
      resetEdit();
    }

    onMounted(() => {
      getAllTasks();
    });

    provide('db', db);
    provide('tasks', tasks);
    provide('darkMode', darkMode);
    provide('creatingTask', creatingTask);
    provide('showingShare', showingShare);
    provide('showingEdit', showingEdit);
    provide('sharingTask', sharingTask);
    provide('editingTask', editingTask);
    provide('newTask', newTask);
    provide('resetNewTask', resetNewTask);
    provide('resetShare', resetShare);
    provide('resetEdit', resetEdit);
    provide('addNewTask', addNewTask);
    provide('deleteTask', deleteTask);
    provide('shareTask', shareTask);
    provide('editTask', editTask);
    provide('saveEditingTask', saveEditingTask);
    provide('toggleDarkMode', toggleDarkMode);

    return {
      darkMode,
      toggleDarkMode,
      showingShare,
      showingEdit,
    };
  },
  components: {
    Navbar,
    TaskGrid,
    DarkModeButtons,
    OverlayEdit,
    OverlayShare,
    OverlayCreateTask,
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
  &--lock-y {
    overflow-y: hidden;
  }

  &__button {
    position: fixed;
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
}

.fall-enter-active,
.fall-leave-active {
  transition: opacity 400ms ease, transform 400ms ease;
}

.fall-leave-to,
.fall-enter-from {
  opacity: 0;
  transform: scale(1.5);
}

.toggle-buttons-enter-active,
.toggle-buttons-leave-active {
  transition: transform 400ms ease-out, opacity 400ms ease-out;
}

.toggle-buttons-enter-from,
.toggle-buttons-leave-to {
  transform: translateX(30px);
  opacity: 0;
}
</style>
