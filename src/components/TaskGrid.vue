<template>
  <!-- <v-container>
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
                    @click="showOverlayPhoto(getPhoto(task.photo))"
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
  </v-container> -->
  <div class="container">
    <transition-group name="list">
      <div v-for="date in taskDates" :key="date" class="tasks">
        <h2 :key="date" :class="{ tasks__date: true, 'tasks__date--dark': darkMode }">
          {{ formatDate(date) }}
        </h2>
        <transition-group name="list" tag="ul" class="tasks__list">
          <TaskGridItem
            v-for="task in sortedTasks[date]"
            :key="task.id"
            @self-delete="deleteTask(task.id)"
            @self-share="shareTask(task)"
          >
            <template #default>{{ task.className }}</template>
            <template #task>{{ formatTask(task.task) }}</template>
          </TaskGridItem>
        </transition-group>
      </div>
    </transition-group>
  </div>
</template>

<script>
import { computed, inject } from 'vue';
import { DateTime } from 'luxon';
import DOMpurify from 'dompurify';
import marked from 'marked';

import TaskGridItem from './TaskGridItem.vue';
// import PhotoOverlay from './PhotoOverlay.vue';
// import TaskEditOverlay from './TaskEditOverlay.vue';
// import TaskShareOverlay from './TaskShareOverlay.vue';

export default {
  name: 'TaskGrid',
  setup() {
    const tasks = inject('tasks');
    const darkMode = inject('darkMode');
    const shareTask = inject('shareTask');
    const deleteTask = inject('deleteTask');

    const taskDates = computed(() => {
      const dates = new Set(tasks.value.map((task) => task.finishDate.substring(0, 10)));
      return Array.from(dates).sort((a, b) => new Date(a) - new Date(b));
    });
    const sortedTasks = computed(() => {
      const data = {};
      taskDates.value.forEach((date) => {
        data[date] = tasks.value
          .map((item) => {
            if (item.finishDate.substring(0, 10) === date) {
              return item;
            }
            return false;
          })
          .filter((item) => !!item);
      });
      return data;
    });

    function formatDate(date) {
      return DateTime.fromISO(date).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY);
    }
    function formatTask(task) {
      const t = DOMpurify.sanitize(task);
      return marked(t, { headerIds: false });
    }

    return {
      tasks,
      taskDates,
      sortedTasks,
      darkMode,
      formatDate,
      formatTask,
      shareTask,
      deleteTask,
    };
  },
  // props: {
  //   dark: {
  //     type: Boolean,
  //     required: true,
  //     default: false,
  //   },
  //   tasks: {
  //     type: Array,
  //     required: true,
  //     default: Array.from(0),
  //   },
  //   db: IDBDatabase,
  // },
  components: {
    TaskGridItem,
    //   PhotoOverlay,
    //   TaskEditOverlay,
    //   TaskShareOverlay,
  },
  // data() {
  //   return {
  //     value: false,
  //     overlayPhoto: '',
  //     currentlyEditing: false,
  //     currentlyEditTask: {},
  //     currentlySharing: false,
  //     currentlySharingTask: {},
  //   };
  // },
  // computed: {
  //   getDates() {
  //     const dates = new Set(this.tasks.map((task) => task.finishDate.substring(0, 10)));
  //     return Array.from(dates).sort((a, b) => new Date(a) - new Date(b));
  //   },
  //   // returns tasks for specific date
  //   getSortedTasks() {
  //     const dates = this.getDates;
  //     const data = {};
  //     for (let i = 0; i < dates.length; i += 1) {
  //       data[dates[i]] = this.tasks
  //         .map((item) => {
  //           if (item.finishDate.substring(0, 10) === dates[i]) {
  //             return item;
  //           }
  //           return false;
  //         })
  //         .filter((item) => !!item);
  //     }
  //     return Object.values(data);
  //   },
  // },
  // methods: {
  //   formatDate(date) {
  //     return DateTime.fromISO(date)
  //       .setLocale('uk')
  //       .toFormat('dd LLL yyyy');
  //   },
  //   shareItem(task) {
  //     this.currentlySharingTask = task;
  //     this.currentlySharing = true;
  //   },
  //   delItem(id) {
  //     this.$emit('delete', id);
  //   },
  //   delItems(items) {
  //     this.$emit('delete-items', items);
  //   },
  //   getPhoto(photo) {
  //     return `data:image/*;base64,${btoa(photo)}`;
  //   },
  //   showOverlayPhoto(photo) {
  //     this.overlayPhoto = photo;
  //     this.value = true;
  //   },
  //   showEditTaskOverlay(editTask) {
  //     this.currentlyEditTask = editTask;
  //     this.currentlyEditing = true;
  //   },
  //   emitDeleteItemPhoto(id) {
  //     this.$emit('delete-item-photo', id);
  //   },
  //   emitUpdateTask(item) {
  //     this.$emit('update-task', item);
  //   },
  // },
};
</script>

<style lang="scss" scoped>
.container {
  max-width: 1000px;
  margin: 0.5rem auto;
  padding: 0.25rem 0.5rem;
}
.tasks {
  margin-bottom: 1.5rem;

  &__date {
    font-size: 1.5rem;
    color: rgb(48, 48, 48);
    margin-bottom: 0.75rem;
    position: relative;
    transition: color 400ms ease-out;

    &--dark {
      color: rgb(214, 214, 214);
    }

    &::after {
      content: '';
      position: absolute;
      bottom: calc(-0.75rem / 2);
      left: 0;
      width: 100%;
      height: 1px;
      background-color: #999;
    }
  }
  &__list {
    padding: 0 0.5rem;
    list-style-type: none;
  }
}

.list-enter-active,
.list-leave-active {
  transition: transform 400ms ease, opacity 400ms ease;
}
.list-leave-active {
  position: absolute;
  width: calc(100% * 0.926);
  max-width: 966px;
}
.list-move {
  transition: transform 400ms ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-300px);
}
</style>
