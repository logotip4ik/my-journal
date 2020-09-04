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
        :show="showTaskOverlay"
        @close="showTaskOverlay = !showTaskOverlay"/>
    </v-main>
  </v-app>
</template>

<script>
import { openDB } from 'idb';

import TaskOverlay from './components/TaskOverlay.vue';

export default {
  name: 'App',
  components: {
    TaskOverlay,
  },
  data() {
    return {
      showTaskOverlay: false,
      db: null,
    };
  },
  async mounted() {
    const db = await openDB('journal', 1, {
      upgrade(DB) {
        DB.createObjectStore('homework', { keyPath: 'finishDate', autoIncrement: false });
      },
    });
    this.db = db;
  },
};
</script>
