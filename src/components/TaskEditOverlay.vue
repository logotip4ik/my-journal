<template>
  <v-dialog v-model="show" max-width="650px" :dark="dark">
    <v-card max-width="650px" :dark="dark">
      <v-container>
        <v-form>
          <v-text-field
            required
            clearable
            autofocus
            label="Class name"
            v-model.trim="ClassName"/>
          <v-textarea
            required
            rows="2"
            clearable
            auto-grow
            label="Task"
            row-height="16"
            v-model.trim="Task"/>
          <v-text-field
            required
            type="date"
            label="Finish date"
            v-model="finishDateFormatted"/>
        </v-form>
      </v-container>
      <v-card-actions>
        <v-btn
          v-if="Photo"
          @click="deletePhoto"
          color="primary" outlined>Delete Photo</v-btn>
        <v-btn
          v-if="Photo"
          @click="downloadPhoto"
          color="primary">Download Photo</v-btn>
        <v-spacer/>
        <v-btn @click="handleSave" color="primary">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { v4 } from 'uuid';

export default {
  name: 'TaskEditOverlay',
  props: {
    value: {
      type: Boolean,
      required: true,
      default: false,
    },
    task: {
      type: Object,
      required: true,
      default: () => ({}),
    },
    dark: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  data() {
    return {
      ID: null,
      ClassName: null,
      Task: null,
      FinishDate: null,
      Photo: null,
    };
  },
  watch: {
    task(task) {
      if (!task) return;
      this.ID = task.id;
      this.ClassName = task.className;
      this.Task = task.task;
      this.FinishDate = task.finishDate;
      this.Photo = task.photo;
      this.CreatedDate = task.createdDate;
    },
  },
  computed: {
    finishDateFormatted() {
      return this.FinishDate?.substring(0, 10);
    },
    show: {
      get() {
        return this.value;
      },
      set() {
        this.$emit('close');
      },
    },
  },
  methods: {
    handleSave() {
      const newItem = {
        id: this.ID,
        className: this.ClassName,
        task: this.Task,
        photo: this.Photo,
        finishDate: this.FinishDate,
        createdDate: this.CreatedDate,
      };
      this.$emit('update-task', newItem);
      this.$emit('close');
    },
    deletePhoto() {
      this.$emit('delete-item-photo', this.ID);
      this.$emit('close');
    },
    downloadPhoto() {
      const element = document.createElement('a');
      element.setAttribute('href', this.getPhoto(this.Photo));
      element.setAttribute('download', `${v4()}.jpg`);
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      this.$emit('close');
    },
    getPhoto(photo) {
      return !photo ? null : `data:image/*;base64,${btoa(photo)}`;
    },
  },
};
</script>
