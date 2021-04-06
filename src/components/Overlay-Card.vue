<template>
  <transition name="fall">
    <div v-if="value" class="card-container">
      <div :class="{ card: true, 'card--dark': darkMode, 'card--image': image }" ref="card">
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script>
import { inject, ref, watch } from 'vue';
import Hammer from 'hammerjs';
import gsap from 'gsap';

export default {
  setup(props) {
    const card = ref(null);

    const darkMode = inject('darkMode');

    function checkForKey({ key }) {
      if (key === 'Escape') props.onEsc.call();
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
              onComplete: props.onEsc,
            });
          } else if (deltaY < 200 && deltaY > 0) {
            slideItemToY(0);
          }
        }
      });
    }

    watch(props, ({ value }) => {
      if (value) {
        window.addEventListener('keyup', checkForKey);
        setTimeout(initHammer, 400);
      } else if (!value) {
        window.removeEventListener('keyup', checkForKey);
      }
    });

    return {
      darkMode,
      card,
    };
  },
  props: {
    value: {
      type: Boolean,
      required: true,
      default: false,
    },
    image: {
      type: Boolean,
      required: false,
      default: false,
    },
    onEsc: {
      type: Function,
      required: true,
      default: () => {},
    },
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
  z-index: 999999;
}

.card {
  flex-grow: 1;
  border-radius: 0.25rem;
  border: 1px solid transparent;
  background-color: white;
  padding: 0.5rem;
  max-height: 95vh;
  max-width: 350px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: auto;
  transition: border-color 400ms ease-out, background-color 400ms ease-out;

  &--dark {
    border-color: rgba($color: #ffffff, $alpha: 0.1);
    background-color: #1f2022;
  }
  &--image {
    max-width: 800px;
    max-height: 95%;
    width: auto;
    margin-top: 56px;
    img {
      object-fit: contain;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
