<template>
  <v-dialog v-model="show">
      <v-img
        :max-width="getMaxWidth"
        :max-height="getMaxHeight" :src="photo" />
  </v-dialog>
</template>

<script>
export default {
  name: 'PhotoOverlay',
  props: {
    photo: {
      type: String,
      required: true,
    },
    value: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  computed: {
    show: {
      get() {
        return this.value;
      },
      set() {
        this.$emit('close');
      },
    },
    getMaxWidth() {
      return window.innerWidth - 12;
    },
    getMaxHeight() {
      return window.innerHeight - 15;
    },
  },
};
</script>
