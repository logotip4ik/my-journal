<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark>
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

    <v-main>
      <TaskOverlay
        :db="db"
        @close="closeOverlay"
        :show="showTaskOverlay"/>
      <Grid
        :db="db"
        :tasks="tasks"
        @delete="deleteItem"/>
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
    };
  },
  async mounted() {
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
  },
};
</script>
