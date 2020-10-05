<template>
  <v-dialog max-width="400" max-height="610" v-model="value">
    <v-card :dark="dark" max-width="400" max-height="610">
      <div class="d-flex flex-column mb-2">
        <h1 class="heading ml-2">QR code:</h1>
        <v-img :src="urlToQrCode" :height="showWarning ? 100 : null" contain />
      </div>
      <v-divider />
      <v-card-actions v-show="!showWarning">
        <v-spacer />
        <v-btn class="mt-2" :dark="dark" @click="copyURL">Copy just the URl</v-btn>
        <v-spacer />
      </v-card-actions>
      <div v-show="showWarning" class="px-2 pb-2">
        <h3>Your browser does not support clipboard. Just copy url manually</h3>
        <code>{{ urlToShare }}</code>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import qrcode from 'qrcode-generator';

export default {
  name: 'TaskShareOverlay',
  data() {
    return {
      showWarning: false,
    };
  },
  props: {
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
    task: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
  computed: {
    value: {
      get() {
        return this.show;
      },
      set() {
        this.$emit('close');
      },
    },
    urlToShare() {
      if (!this.task) return '';
      const taskToShare = {
        ...this.task,
        photo: null,
      };
      return `${window.location.href}?shared_task=${btoa(JSON.stringify(taskToShare))}`;
    },
    urlToQrCode() {
      if (!this.show && !this.task) return '';
      const qr = qrcode(0, 'L');

      qr.addData(this.urlToShare);
      qr.make();

      return qr.createDataURL();
    },
  },
  methods: {
    copyURL() {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(this.urlToShare);
        this.$emit('close');
        return;
      }
      this.showWarning = true;
    },
  },
};
</script>

<style></style>
