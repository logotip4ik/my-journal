<template>
  <v-app :dark="darkMode" :class="darkMode ? 'dark-background' : null">
    <v-app-bar
      app
      dark
      :color="darkMode ? 'grey darken-4' : 'primary'">
      <v-toolbar-title>
        Journal
      </v-toolbar-title>
      <v-spacer />
      <div>
        <v-btn icon @click="showTaskOverlay = !showTaskOverlay">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </div>
    </v-app-bar>

    <v-main :dark="darkMode">
      <TaskOverlay
        :db="db"
        :dark="darkMode"
        @close="closeOverlay"
        :show="showTaskOverlay"/>
      <Grid
        :db="db"
        :dark="darkMode"
        :tasks="tasks"
        @delete="deleteItem"/>
      <v-btn fab fixed bottom left @click="toggleMode" :dark="darkMode">
        <v-icon v-if="darkMode">mdi-white-balance-sunny</v-icon>
        <v-icon v-else>mdi-weather-night</v-icon>
      </v-btn>
    </v-main>
  </v-app>
</template>

<script>
import { openDB } from 'idb';

import Grid from './components/Grid.vue';
import TaskOverlay from './components/TaskOverlay.vue';

export default {
  name: 'App',
  components: {
    Grid,
    TaskOverlay,
  },
  data() {
    return {
      showTaskOverlay: false,
      tasks: [],
      db: null,
      test: true,
      darkMode: false,
    };
  },
  async mounted() {
    if (localStorage.darkMode) {
      this.darkMode = JSON.parse(localStorage.darkMode);
    }
    const db = await openDB('journal-store', 1, {
      upgrade(dataBase) {
        dataBase.createObjectStore('homework', {
          keyPath: 'id',
        });
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
    toggleMode() {
      this.darkMode = !this.darkMode;
      localStorage.darkMode = JSON.stringify(this.darkMode);
    },
  },
};
</script>

<style scoped>
.dark-background {
  background-color: black!important;
}
</style>
