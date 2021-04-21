<template>
  <div :class="{ main: true, 'main--dark': darkMode }">
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
import { onMounted, provide, reactive, ref, watch } from 'vue';
import { useDark, useToggle } from '@vueuse/core';
import { DateTime } from 'luxon';
import { v4 } from 'uuid';
import filesize from 'filesize.js';

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
      photoName: 'Upload image',
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
      newTask.photo = null;
      newTask.photoName = 'Upload image';
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
    function setImage({ target }) {
      if (target) {
        newTask.photoName = `${target.files[0].name} ${filesize(target.files[0].size)}`;
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          newTask.photo = reader.result;
        });
        reader.readAsArrayBuffer(target.files[0]);
      } else {
        newTask.photo = null;
        newTask.photoName = 'Upload image';
      }
    }
    function setImageEditing({ target }) {
      if (target) {
        editingTask.value.photoName = `${target.files[0].name} ${filesize(target.files[0].size)}`;
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          editingTask.value.photo = reader.result;
        });
        reader.readAsArrayBuffer(target.files[0]);
      } else {
        editingTask.value.photo = null;
        editingTask.value.photoName = 'Upload image';
      }
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
      tasks.value.push(task);
      resetNewTask();
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

    watch([creatingTask, showingShare, showingEdit], (values) => {
      for (let i = 0; i < values.length; i += 1) {
        if (values[i]) {
          document.body.classList.add('lock-scroll');
          break;
        } else document.body.classList.remove('lock-scroll');
      }
    });

    onMounted(() => {
      getAllTasks();
    });

    provide('db', db);
    provide('tasks', tasks);
    provide('darkMode', darkMode);
    provide('setImage', setImage);
    provide('setImageEditing', setImageEditing);
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
}

.lock-scroll {
  overflow: hidden;
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
</style>
