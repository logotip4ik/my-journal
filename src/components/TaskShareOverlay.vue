<template>
  <transition name="fall">
    <div class="card-container" v-if="showingShare">
      <div :class="{ card: true, 'card--dark': darkMode }" ref="card">
        <img :src="urlToQrCode" alt="" />
        OR
        <button :class="{ card__button: true, 'card__button--dark': darkMode }" @click="copyURL">
          Copy URL
        </button>
      </div>
    </div>
  </transition>
</template>

<script>
// eslint-disable-next-line
import { computed, inject, ref, watch } from 'vue';
import Hammer from 'hammerjs';
import gsap from 'gsap';
import qrcode from 'qrcode-generator';

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
    function checkForKey(ev) {
      if (ev.key === 'Escape') resetShare();
    }
    function slideItemToY(x) {
      gsap.to(card.value, {
        translateY: `${x}px`,
        duration: 0.3,
      });
    }
    function initHammer() {
      const hammertime = new Hammer.Manager(card.value);
      hammertime.add(new Hammer.Pan({ direction: Hammer.DIRECTION_VERTICAL, threshold: 0 }));

      hammertime.on('panstart panmove', ({ deltaY }) => {
        if (deltaY > 0) {
          slideItemToY(deltaY);
        } else if (deltaY < 0) {
          slideItemToY(deltaY * 0.2);
        }
      });
      hammertime.on('hammer.input', ({ isFinal, deltaY }) => {
        if (isFinal) {
          if (deltaY < 0) {
            slideItemToY(0);
          } else if (deltaY > 200) {
            gsap.to(card.value, {
              yPercent: 100,
              duration: 0.3,
              onComplete: resetShare,
            });
          } else if (deltaY < 200 && deltaY > 0) {
            slideItemToY(0);
          }
        }
      });
    }

    watch(showingShare, (value, oldValue) => {
      if (value && !oldValue) {
        window.addEventListener('keyup', checkForKey);
        setTimeout(initHammer, 400);
      } else if (!value && oldValue) {
        window.removeEventListener('keyup', checkForKey);
      }
    });

    return {
      card,
      darkMode,
      showingShare,
      sharingTask,
      resetShare,
      copyURL,
      urlToQrCode,
    };
  },
  // data() {
  //   return {
  //     showWarning: false,
  //   };
  // },
  // props: {
  //   dark: {
  //     type: Boolean,
  //     required: true,
  //     default: false,
  //   },
  //   show: {
  //     type: Boolean,
  //     required: true,
  //     default: false,
  //   },
  //   task: {
  //     type: Object,
  //     required: true,
  //     default: () => ({}),
  //   },
  // },
  // computed: {
  //   value: {
  //     get() {
  //       return this.show;
  //     },
  //     set() {
  //       this.$emit('close');
  //     },
  //   },
  //   urlToShare() {
  //     if (!this.task) return '';
  //     const taskToShare = {
  //       ...this.task,
  //       photo: null,
  //     };
  //     // const keys = Object.keys(this.item);
  //     // const values = Object.values(this.item);
  //     // const taskToShare = {};
  //     // for (let i; i < keys.length; i += 1) {
  //     //   taskToShare[keys[i]] = encodeURI()
  //     // }
  //     return `${window.location.href}
  // ? shared_task=${btoa(encodeURI(JSON.stringify(taskToShare)))}`;
  //   },
  //   urlToQrCode() {
  //     if (!this.show && !this.task) return '';
  //     const qr = qrcode(0, 'L');

  //     try {
  //       qr.addData(this.urlToShare);
  //       qr.make();

  //       return qr.createDataURL();
  //     } catch (error) {
  //       console.log(error);
  //     }
  //     return null;
  //   },
  // },
  // methods: {
  //   copyURL() {
  //     if (navigator.clipboard) {
  //       navigator.clipboard.writeText(this.urlToShare);
  //       this.$emit('close');
  //       return;
  //     }
  //     this.showWarning = true;
  //   },
  // },
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

.fall-enter-active,
.fall-leave-active {
  transition: opacity 400ms ease, transform 400ms ease;
}

.fall-leave-to,
.fall-enter-from {
  opacity: 0;
  transform: scale(1.5);
}
</style>
