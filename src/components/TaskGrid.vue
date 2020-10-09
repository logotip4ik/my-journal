<template>
  <v-container>
    <v-slide-y-transition group>
      <v-list :dark="dark" v-for="(date, idx) in getDates" :key="idx">
        <v-subheader class="headline" style="font-size: 2em!important;">
          {{ new Date(date).toLocaleDateString() }}
          <v-spacer />
          <v-btn icon color="red" @click="delItems(getSortedTasks[idx])">
            <v-icon>mdi-minus</v-icon>
          </v-btn>
        </v-subheader>
        <v-spacer />
        <v-divider />
        <v-slide-y-transition group>
          <v-list-item v-for="task in getSortedTasks[idx]" :key="task.id" class="mt-2">
            <v-card :dark="dark" min-width="100%" min-height="100%" class="pa-2" elevation="1">
              <v-list-item-title
                class="headline"
                :style="{ fontSize: '1.5em!important', cursor: 'help' }"
                @click="showEditTaskOverlay(task)"
              >
                {{ task.className }}
              </v-list-item-title>
              <v-list-item-subtitle :class="dark ? 'white--text' : null">
                {{ formatDate(task.finishDate) }}
              </v-list-item-subtitle>
              <div class="d-flex">
                <v-list-item-content style="font-size: 1.6rem;">
                  {{ task.task }}
                </v-list-item-content>
                <v-list-item-content v-if="task.photo">
                  <v-img
                    contain
                    max-height="200"
                    :style="{ cursor: 'zoom-in' }"
                    @click.native="showOverlayPhoto(getPhoto(task.photo))"
                    :src="getPhoto(task.photo)"
                  />
                </v-list-item-content>
              </div>
              <v-btn icon absolute top right color="red" @click="delItem(task.id)">
                <v-icon>mdi-delete-outline</v-icon>
              </v-btn>
              <v-btn icon absolute bottom right color="blue" @click="shareItem(task)">
                <v-icon>mdi-share</v-icon>
              </v-btn>
            </v-card>
          </v-list-item>
        </v-slide-y-transition>
      </v-list>
    </v-slide-y-transition>
    <PhotoOverlay :value="value" :photo="overlayPhoto" @close="value = !value" />
    <TaskEditOverlay
      :db="db"
      :dark="dark"
      :value="currentlyEditing"
      :task="currentlyEditTask"
      @update-task="emitUpdateTask"
      @delete-item-photo="emitDeleteItemPhoto"
      @close="currentlyEditing = false"
    />
    <TaskShareOverlay
      :dark="dark"
      :show="currentlySharing"
      :task="currentlySharingTask"
      @close="currentlySharing = false"
    />
    <v-snackbar v-model="currentlySharing" color="warning">
      Currently photos are not shared
    </v-snackbar>
  </v-container>
</template>

<script>
import { DateTime } from 'luxon';

import PhotoOverlay from './PhotoOverlay.vue';
import TaskEditOverlay from './TaskEditOverlay.vue';
import TaskShareOverlay from './TaskShareOverlay.vue';

export default {
  name: 'TaskGrid',
  props: {
    dark: {
      type: Boolean,
      required: true,
      default: false,
    },
    tasks: {
      type: Array,
      required: true,
      default: Array.from(0),
    },
    db: IDBDatabase,
  },
  components: {
    PhotoOverlay,
    TaskEditOverlay,
    TaskShareOverlay,
  },
  data() {
    return {
      value: false,
      overlayPhoto: '',
      currentlyEditing: false,
      currentlyEditTask: {},
      currentlySharing: false,
      currentlySharingTask: {},
    };
  },
  computed: {
    getDates() {
      const dates = new Set(this.tasks.map((task) => task.finishDate.substring(0, 10)));
      return Array.from(dates).sort((a, b) => new Date(a) - new Date(b));
    },
    // returns tasks for specific date
    getSortedTasks() {
      const dates = this.getDates;
      const data = {};
      for (let i = 0; i < dates.length; i += 1) {
        data[dates[i]] = this.tasks
          .map((item) => {
            if (item.finishDate.substring(0, 10) === dates[i]) {
              return item;
            }
            return false;
          })
          .filter((item) => !!item);
      }
      return Object.values(data);
    },
  },
  methods: {
    formatDate(date) {
      return DateTime.fromISO(date)
        .setLocale('uk')
        .toFormat('dd LLL yyyy');
    },
    shareItem(task) {
      this.currentlySharingTask = task;
      this.currentlySharing = true;
    },
    delItem(id) {
      this.$emit('delete', id);
    },
    delItems(items) {
      this.$emit('delete-items', items);
    },
    getPhoto(photo) {
      return `data:image/*;base64,${btoa(photo)}`;
    },
    showOverlayPhoto(photo) {
      this.overlayPhoto = photo;
      this.value = true;
    },
    showEditTaskOverlay(editTask) {
      this.currentlyEditTask = editTask;
      this.currentlyEditing = true;
    },
    emitDeleteItemPhoto(id) {
      this.$emit('delete-item-photo', id);
    },
    emitUpdateTask(item) {
      this.$emit('update-task', item);
    },
  },
};
</script>
