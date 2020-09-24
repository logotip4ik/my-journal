<template>
  <v-app :dark="darkMode" :class="darkMode ? 'dark-background' : null">
    <v-main :dark="darkMode">
      <Navbar
       :dark="darkMode"
       @add-task="toggleViewTaskOverlay"/>
      <TaskOverlay
        :db="db"
        :dark="darkMode"
        @close="closeOverlay"
        :show="showTaskOverlay"/>
      <TaskGrid
        :db="db"
        :dark="darkMode"
        :tasks="tasks"
        @delete="deleteItem"
        @update-task="updateTask"
        @delete-item-photo="deleteItemPhoto"
        @delete-items="deleteItems"/>
      <v-btn fab fixed bottom left @click="toggleMode" :dark="darkMode">
        <v-icon v-if="darkMode">mdi-white-balance-sunny</v-icon>
        <v-icon v-else>mdi-weather-night</v-icon>
      </v-btn>
    </v-main>
  </v-app>
</template>

<script>
import { openDB } from 'idb';

import Navbar from './components/Navbar.vue';
import TaskGrid from './components/TaskGrid.vue';
import TaskOverlay from './components/TaskOverlay.vue';

export default {
  name: 'App',
  components: {
    Navbar,
    TaskGrid,
    TaskOverlay,
  },
  data() {
    return {
      showTaskOverlay: false,
      tasks: [],
      db: null,
      darkMode: false,
    };
  },
  async mounted() {
    if (localStorage.darkMode) {
      this.darkMode = JSON.parse(localStorage.darkMode);
    }
    const db = await openDB('journal-store', 1, {
      upgrade(dataBase) {
        if (!dataBase.objectStoreNames.contains('homework')) {
          dataBase.createObjectStore('homework', {
            keyPath: 'id',
          });
        }
      },
    });
    const tasks = await db.getAll('homework');
    this.db = db;
    this.tasks = tasks;
  },
  computed: {
    sortedTasks() {
      const { tasks } = this;
      if (tasks.length === 0) return [];
      return tasks.sort((a, b) => new Date(a.finishDate) - new Date(b.finishDate));
    },
  },
  methods: {
    closeOverlay(task) {
      if (task) {
        this.tasks.push(task);
      }
      this.showTaskOverlay = !this.showTaskOverlay;
    },
    deleteItem(id) {
      this.db.delete('homework', id);
      this.tasks = this.tasks.filter((task) => task.id !== id);
    },
    deleteItems(items) {
      items.forEach(({ id }) => this.deleteItem(id));
    },
    async deleteItemPhoto(id) {
      const newItem = await this.db.get('homework', id);
      newItem.photo = null;
      this.tasks = this.tasks.map((item) => (
        item.id === newItem.id ? newItem : item
      ));
      this.db.delete('homework', id);
      this.db.add('homework', newItem);
    },
    async updateTask(task) {
      this.tasks = this.tasks.map((item) => (
        item.id === task.id ? task : item
      ));
      await this.db.delete('homework', task.id);
      await this.db.add('homework', task);
    },
    toggleMode() {
      this.darkMode = !this.darkMode;
      localStorage.darkMode = this.darkMode;
    },
    toggleViewTaskOverlay() {
      this.showTaskOverlay = !this.showTaskOverlay;
    },
  },
};
</script>

<style scoped>
.dark-background {
  background-color: black!important;
}
</style>
