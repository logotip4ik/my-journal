<template>
  <!-- <v-app :dark="darkMode" :class="darkMode ? 'dark-background' : null">
    <v-main :dark="darkMode">
      <Navbar :dark="darkMode" @add-task="toggleViewTaskOverlay" />
      <TaskOverlay :db="db" :dark="darkMode" @close="closeOverlay" :show="showTaskOverlay" />
      <TaskGrid
        :db="db"
        :dark="darkMode"
        :tasks="tasks"
        @delete="deleteItem"
        @update-task="updateTask"
        @delete-item-photo="deleteItemPhoto"
        @delete-items="deleteItems"
      />
      <v-btn fab fixed bottom left @click="toggleMode" :dark="darkMode">
        <v-icon v-if="darkMode">mdi-white-balance-sunny</v-icon>
        <v-icon v-else>mdi-weather-night</v-icon>
      </v-btn>
    </v-main>
  </v-app> -->
  <div :class="{ main: true, 'main--dark': darkMode, 'main--sharing-task': showingShare }">
    <Navbar />
    <TaskOverlay />
    <TaskGrid />
    <TaskShareOverlay />
    <button class="toggleDarkMode" @click="toggleDarkMode">TOGGLE</button>
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
    }

    async function addNewTask() {
      if (!newTask.className || !newTask.task || !newTask.finishDate) return;
      const task = { ...newTask, id: v4(), createdDate: DateTime.local().toISO() };
      await db.homework.put(task);
      resetNewTask();
      tasks.value.push(task);
    }

    async function deleteTask(taskId) {
      tasks.value = tasks.value.filter(({ id }) => id !== taskId);
      await db.homework.delete(taskId);
    }

    async function checkForSharedTask() {
      const params = new URLSearchParams(window.location.search);
      if (params.has('shared_task')) {
        await db.homework.put(JSON.parse(decodeURI(atob(params.get('shared_task')))));
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
    provide('newTask', newTask);
    provide('resetNewTask', resetNewTask);
    provide('resetShare', resetShare);
    provide('addNewTask', addNewTask);
    provide('deleteTask', deleteTask);

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
    //   TaskOverlay,
  },
  // data() {
  //   return {
  //     showTaskOverlay: false,
  //     tasks: [],
  //     db: null,
  //     darkMode: false,
  //   };
  // },
  // async mounted() {
  //   if (localStorage.darkMode) {
  //     this.darkMode = JSON.parse(localStorage.darkMode);
  //   }
  //   const db = await openDB('journal-store', 1, {
  //     upgrade(dataBase) {
  //       if (!dataBase.objectStoreNames.contains('homework')) {
  //         dataBase.createObjectStore('homework', {
  //           keyPath: 'id',
  //         });
  //       }
  //     },
  //   });
  //   this.db = db;
  //   const params = await new URLSearchParams(window.location.search);
  //   if (params.has('shared_task')) {
  //     await db.put('homework', JSON.parse(decodeURI(atob(params.get('shared_task')))));
  //     const url = window.location.href.split('?')[0];
  //     window.history.pushState('', '', url);
  //   }
  //   const tasks = await db.getAll('homework');
  //   this.tasks = tasks;
  // },
  // computed: {
  //   sortedTasks() {
  //     const { tasks } = this;
  //     if (tasks.length === 0) return [];
  //     return tasks.sort((a, b) => new Date(a.finishDate) - new Date(b.finishDate));
  //   },
  // },
  // methods: {
  //   closeOverlay(task) {
  //     if (task) {
  //       this.tasks.push(task);
  //     }
  //     this.showTaskOverlay = !this.showTaskOverlay;
  //   },
  //   deleteItem(id) {
  //     this.db.delete('homework', id);
  //     this.tasks = this.tasks.filter((task) => task.id !== id);
  //   },
  //   deleteItems(items) {
  //     items.forEach(({ id }) => this.deleteItem(id));
  //   },
  //   async deleteItemPhoto(id) {
  //     const newItem = await this.db.get('homework', id);
  //     newItem.photo = null;
  //     this.tasks = this.tasks.map((item) => (item.id === newItem.id ? newItem : item));
  //     this.db.delete('homework', id);
  //     this.db.add('homework', newItem);
  //   },
  //   async updateTask(task) {
  //     this.tasks = this.tasks.map((item) => (item.id === task.id ? task : item));
  //     await this.db.delete('homework', task.id);
  //     await this.db.add('homework', task);
  //   },
  //   toggleMode() {
  //     this.darkMode = !this.darkMode;
  //     localStorage.darkMode = this.darkMode;
  //   },
  //   toggleViewTaskOverlay() {
  //     this.showTaskOverlay = !this.showTaskOverlay;
  //   },
  // },
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
}
.toggleDarkMode {
  position: fixed;
  bottom: 2rem;
  left: 2rem;
}
</style>
