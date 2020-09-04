<template>
  <v-dialog
    fullscreen
    hide-overlay
    v-model="dialog"
    transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar color="primary" dark>
        <v-btn icon @click="close"><v-icon>mdi-close</v-icon></v-btn>
        <v-toolbar-title>Task</v-toolbar-title>
        <v-spacer/>
        <v-toolbar-items>
          <v-btn @click="addTask" icon>save</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-form @submit.prevent="addTask">
        <v-list three-line subheader max-width="1200" class="mx-auto">
          <v-list-item>
            <v-text-field
              clearable
              label="Class name"
              v-model="className"
              placeholder="Укр мова..."
              :error="!className && error"
              :error-messages="!className && error ? 'Please fill out this field' : null"/>
          </v-list-item>
          <v-list-item>
            <v-text-field
              clearable
              label="Task"
              v-model="task"
              :error="!task && error"
              placeholder="№345..."
              :error-messages="!task && error ? 'Please fill out this field' : null"/>
          </v-list-item>
          <v-list-item>
            <v-text-field
              type="date"
              label="Class name"
              v-model="_finishDate"
              :error="!_finishDate && error"
              placeholder="Укр мова..."
              :error-messages="!_finishDate && error ? 'Please fill out this field' : null"/>
          </v-list-item>
        </v-list>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { DateTime } from 'luxon';
import { openDB } from 'idb';

export default {
  name: 'TaskOverlay',
  props: {
    show: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  data() {
    return {
      error: false,
      className: '',
      task: '',
      finishDate: DateTime.local().plus({ days: 1 }).toISO(),
      db: null,
    };
  },
  async mounted() {
    const db = await openDB('journal');
    this.db = db;
  },
  computed: {
    dialog: {
      get() {
        return this.show;
      },
      set() {
        this.$emit('close');
      },
    },
    // eslint-disable-next-line
    _finishDate: {
      get() {
        return this.finishDate.substring(0, 10);
      },
      set(val) {
        this.finishDate = val;
      },
    },
  },
  methods: {
    close() {
      this.$emit('close');
    },
    async addTask() {
      if (!this.className || !this.task || !this.finishDate) {
        this.error = true;
        return;
      }
      this.error = false;
      const data = {
        className: this.className,
        task: this.task,
        finishDate: this.finishDate,
        createdDate: DateTime.local().toISO(),
      };
      const store = this.db.transaction('homework', 'readwrite').objectStore('homework');
      await store.put(data);
      this.$emit('close');
    },
  },
};
</script>
