<template>
  <!-- <v-dialog max-width="400" max-height="610" v-model="value">
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
  </v-dialog> -->
  <transition name="fall">
    <div class="card-container" v-if="showingShare">
      <div :class="{ card: true, 'card--dark': darkMode }" ref="card">
        <!-- asdasdasdasdasdasda sd a sd asd a sd -->
        <img src="https://via.placeholder.com/400" alt="" />
      </div>
    </div>
  </transition>
</template>

<script>
import { inject, ref, watch } from 'vue';
import Hammer from 'hammerjs';
import gsap from 'gsap';
// import qrcode from 'qrcode-generator';

export default {
  name: 'TaskShareOverlay',
  setup() {
    const card = ref(null);

    const darkMode = inject('darkMode');
    const resetShare = inject('resetShare');
    const showingShare = inject('showingShare');

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
      resetShare,
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
  transition: border-color 400ms ease-out, background-color 400ms ease-out;

  &--dark {
    border-color: rgba($color: #ffffff, $alpha: 0.1);
    background-color: #1f2022;
  }

  img {
    display: block;
    width: 100%;
    height: auto;
    user-select: none;
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
