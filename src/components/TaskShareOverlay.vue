<template>
  <v-dialog max-width="400" max-height="610" v-model="value">
    <v-card :dark="dark" max-width="400" max-height="610">
      <div class="d-flex flex-column mb-2" v-if="urlToQrCode">
        <h1 class="heading ml-2">QR code:</h1>
        <v-img :src="urlToQrCode" :height="showWarning ? 100 : null" contain />
      </div>
      <div class="d-flex flex-column mb-2" v-else>
        <h1 class="heading ml-2">Data is to big to share via QR code!</h1>
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
      // const keys = Object.keys(this.item);
      // const values = Object.values(this.item);
      // const taskToShare = {};
      // for (let i; i < keys.length; i += 1) {
      //   taskToShare[keys[i]] = encodeURI()
      // }
      return `${window.location.href}?shared_task=${btoa(encodeURI(JSON.stringify(taskToShare)))}`;
    },
    urlToQrCode() {
      if (!this.show && !this.task) return '';
      const qr = qrcode(0, 'L');

      try {
        qr.addData(this.urlToShare);
        qr.make();

        return qr.createDataURL();
      } catch (error) {
        console.log(error);
      }
      return null;
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
