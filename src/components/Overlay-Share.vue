<template>
  <OverlayCard :value="showingShare" :onEsc="resetShare">
    <img :src="urlToQrCode" alt="" />
    OR
    <button :class="{ card__button: true, 'card__button--dark': darkMode }" @click="copyURL">
      Copy URL
    </button>
  </OverlayCard>
</template>

<script>
import { computed, inject, ref } from 'vue';
import qrcode from 'qrcode-generator';

import OverlayCard from './Overlay-Card.vue';

export default {
  name: 'TaskShareOverlay',
  setup() {
    const card = ref(null);

    const darkMode = inject('darkMode');
    const resetShare = inject('resetShare');
    const sharingTask = inject('sharingTask');
    const showingShare = inject('showingShare');

    const shareTaskUrl = computed(() => {
      if (!sharingTask.value) return '';
      const encodedURI = encodeURI(JSON.stringify(sharingTask.value));
      return `${window.location.href}?shared_task=${btoa(encodedURI)}`;
    });
    const urlToQrCode = computed(() => {
      const qr = qrcode(0, 'L');
      qr.addData(shareTaskUrl.value);
      qr.make();

      return qr.createDataURL(4, 0);
    });

    async function copyURL() {
      if (!navigator.clipboard) {
        console.warn('clipboard not supported');

        const copyhelper = document.createElement('input');
        copyhelper.style.position = 'fixed';
        copyhelper.style.top = '-100%';
        document.body.appendChild(copyhelper);
        copyhelper.value = shareTaskUrl.value;
        copyhelper.select();
        document.execCommand('copy');
        document.body.removeChild(copyhelper);
      } else {
        await navigator.clipboard.writeText(shareTaskUrl.value);
      }
      resetShare();
    }

    return {
      card,
      darkMode,
      showingShare,
      sharingTask,
      resetShare,
      copyURL,
      qrcode,
      urlToQrCode,
    };
  },
  components: {
    OverlayCard,
  },
};
</script>

<style lang="scss" scoped>
.card-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  background-color: rgba($color: #000000, $alpha: 0.4);
  z-index: 9999;
}
.card {
  border-radius: 0.25rem;
  border: 1px solid transparent;
  background-color: white;
  padding: 0.5rem;
  max-height: 95vh;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: border-color 400ms ease-out, background-color 400ms ease-out;

  &--dark {
    border-color: rgba($color: #ffffff, $alpha: 0.1);
    background-color: #1f2022;
  }

  img {
    display: block;
    width: 100%;
    height: auto;
    touch-action: none;
    margin-bottom: 0.5rem;
  }
  &__button {
    display: inline-block;
    max-width: 150px;
    padding: 0.5rem 1.25rem;
    margin-top: 0.5rem;
    appearance: none;
    font: inherit;
    font-size: 1rem;
    text-transform: uppercase;
    box-shadow: 0 0 10px 0 rgba($color: #000000, $alpha: 0.1),
      inset 0 0 10px 0 rgba($color: #000000, $alpha: 0.1);
    border-radius: 0.25rem;
    border: 1px solid rgba($color: #000000, $alpha: 0.25);
    outline: none;
    background-color: transparent;
    transition: border-color 400ms ease-out, background-color 200ms ease-out, color 200ms ease-out;

    &:hover {
      background-color: lighten($color: #000000, $amount: 20);
      color: white;
    }

    &--dark {
      border-color: rgba($color: white, $alpha: 0.5);
      color: white;

      &:hover {
        background-color: lighten($color: white, $amount: 20);
        color: black;
      }
    }
  }
}
</style>
