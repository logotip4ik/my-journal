<template>
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
  components: {
    TaskGridItem,
  },
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
