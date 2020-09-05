<template>
  <v-container>
    <v-fade-transition group>
      <v-list v-for="(date, idx) in getDates" :key="idx">
        <v-subheader class="headline" style="font-size: 2em!important;">{{date}}</v-subheader>
        <v-divider/>
        <v-fade-transition group>
        <v-list-item v-for="task in getSortedTasks[idx]" :key="task.createdDate" class="mt-2">
            <v-card min-width="100%" min-height="100%" class="pa-2" elevation="1">
              <v-list-item-title class="headline" style="font-size: 1.5em!important;">
                {{task.className}}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{formatDate(task.finishDate)}}
              </v-list-item-subtitle>
              <v-list-item-content style="font-size: 1.6rem;">
                {{task.task}}
              </v-list-item-content>
              <v-btn icon absolute top right color="red" @click="delItem(task.id)">
                <v-icon>mdi-delete-outline</v-icon>
              </v-btn>
            </v-card>
        </v-list-item>
        </v-fade-transition>
      </v-list>
    </v-fade-transition>
  </v-container>
</template>

<script>
import { DateTime } from 'luxon';

export default {
  name: 'Grid',
  props: {
    tasks: {
      type: Array,
      required: true,
      default: Array.from(0),
    },
  },
  computed: {
    getDates() {
      const dates = new Set(this.tasks.map((task) => task.finishDate.substring(0, 10)));
      return Array.from(dates);
    },
    // returns tasks for speciefic date
    getSortedTasks() {
      const dates = this.getDates;
      const data = {};
      for (let i = 0; i < dates.length; i += 1) {
        data[dates[i]] = this.tasks.map((item) => {
          if (item.finishDate.substring(0, 10) === dates[i]) {
            return item;
          } return false;
        }).filter((item) => !!item);
      }
      return Object.values(data);
    },
  },
  methods: {
    formatDate(date) {
      return DateTime.fromISO(date)
        .setLocale('ua')
        .toFormat('dd LLL yyyy');
    },
    delItem(id) {
      this.$emit('delete', id);
    },
  },
};
</script>
