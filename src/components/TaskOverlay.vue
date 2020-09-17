<template>
  <v-dialog
    :dark="dark"
    fullscreen
    hide-overlay
    v-model="dialog"
    transition="dialog-bottom-transition">
    <v-card :dark="dark">
      <v-toolbar :color="dark ? 'grey darken-4' : 'primary'" dark>
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
              required
              clearable
              autofocus
              label="Class name"
              v-model.trim="className"
              placeholder="Укр мова..."
              :error="!className && error"
              :error-messages="!className && error ? 'Please fill out this field' : null"/>
          </v-list-item>
          <v-list-item>
            <v-textarea
              required
              rows="2"
              clearable
              auto-grow
              label="Task"
              row-height="16"
              v-model.trim="task"
              :error="!task && error"
              placeholder="№345..."
              :error-messages="!task && error ? 'Please fill out this field' : null"/>
          </v-list-item>
          <v-list-item>
            <v-text-field
              required
              type="date"
              label="Finish date"
              v-model="finishDate"
              :error="!finishDate && error"
              :error-messages="!finishDate && error ? 'Please fill out this field' : null"/>
          </v-list-item>
          <v-list-item>
            <v-file-input
              v-model="photo"
              show-size
              accept="image/*" chips label="Photo"/>
          </v-list-item>
        </v-list>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { DateTime } from 'luxon';
import { v4 } from 'uuid';

export default {
  name: 'TaskOverlay',
  props: {
    db: IDBDatabase,
    dark: {
      type: Boolean,
      required: true,
      default: false,
    },
    show: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  data() {
    return {
      task: '',
      photo: null,
      error: false,
      className: '',
      finishDate: DateTime.local().plus({ days: 1 }).toISODate(),
    };
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
      if (this.photo) {
        const reader = new FileReader();
        reader.readAsBinaryString(this.photo);
        reader.onload = async (e) => {
          const data = {
            id: v4(),
            task: this.task,
            photo: e.target.result,
            className: this.className,
            finishDate: DateTime.fromISO(this.finishDate).toISO(),
            createdDate: DateTime.local().toISO(),
          };
          await this.db.add('homework', data);
          this.className = '';
          this.task = '';
          this.photo = null;
          this.finishDate = DateTime.local().plus({ days: 1 }).toISODate();
          this.$emit('close', data);
        };
      } else {
        const data = {
          id: v4(),
          task: this.task,
          className: this.className,
          finishDate: DateTime.fromISO(this.finishDate).toISO(),
          createdDate: DateTime.local().toISO(),
        };
        await this.db.add('homework', data);
        this.className = '';
        this.task = '';
        this.finishDate = DateTime.local().plus({ days: 1 }).toISODate();
        this.$emit('close', data);
      }
    },
  },
};
</script>
