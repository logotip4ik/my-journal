<template>
  <li class="item-container">
    <button class="item__button item__button--share" @click="$emit('self-share'), slideItemToX(0)">
      <img src="@/assets/reply-white-18dp.svg" alt="reply image" />
    </button>
    <div :class="{ item: true, 'item--dark': darkMode }" ref="item">
      <h2 class="item__heading"><slot></slot></h2>
      <div class="item__content">
        <p v-html="formatTask(task)"></p>
        <img v-if="photo" :src="image" @click="showingImage = !showingImage" />
      </div>
    </div>
    <button class="item__button item__button--delete" @click="$emit('self-delete')"></button>
    <OverlayCard :value="showingImage" :on-esc="() => (showingImage = !showingImage)" image>
      <img :src="image" />
    </OverlayCard>
  </li>
</template>

<script>
// eslint-disable-next-line
import { inject, onMounted, ref, watch } from 'vue';
import Hammer from 'hammerjs';
import gsap from 'gsap';
import DOMpurify from 'dompurify';
import marked from 'marked';

import OverlayCard from './Overlay-Card.vue';

export default {
  name: 'TaskGridItem',
  setup(props, { emit }) {
    const item = ref(null);
    const image = ref('');
    const showingImage = ref(false);
    const darkMode = inject('darkMode');

    function formatTask(task) {
      const t = DOMpurify.sanitize(task);
      return marked(t, { headerIds: false });
    }
    function slideItemToX(x, up = true) {
      gsap.to(item.value, {
        scale: up ? 1.03 : 1,
        boxShadow: `0 ${up ? 5 : 0}px ${up ? 15 : 10}px 0 rgba(0, 0, 0, 0.${up ? 3 : 2})`,
        translateX: `${x}px`,
        duration: 0.5,
        ease: 'back.out',
      });
    }
    function initHammer() {
      const hammertime = new Hammer.Manager(item.value);

      hammertime.add(new Hammer.Press({ event: 'longpress', time: 300 }));
      hammertime.add(new Hammer.Pan({ direction: Hammer.DIRECTION_HORIZONTAL, threshold: 0 }));

      hammertime.on('longpress', () => {
        emit('self-edit');
      });
      hammertime.on('panstart panmove', ({ deltaX }) => {
        if (deltaX > -100 && deltaX < 100) {
          slideItemToX(deltaX);
        } else {
          const overDeltaX = (deltaX < 0 ? -100 : 100) + deltaX * 0.075;
          slideItemToX(overDeltaX);
        }
      });
      hammertime.on('hammer.input', ({ isFinal, deltaX, velocityX }) => {
        if (isFinal) {
          const delta = deltaX * Math.abs(velocityX);
          if (delta < -50) {
            slideItemToX(-100);
          } else if (delta > 50) {
            slideItemToX(100);
          } else if (delta < 50 && delta > -50) {
            slideItemToX(0, false);
          }
        }
      });
    }
    function convertPhoto() {
      if (!props.photo) return;
      const typedArray = new Uint8Array(props.photo);
      const blob = new Blob([typedArray], { type: 'image/jpeg' });
      image.value = window.URL.createObjectURL(blob);
    }

    watch(props, ({ photo }) => {
      if (photo) convertPhoto();
    });

    onMounted(() => {
      initHammer();
      convertPhoto();
    });

    return {
      item,
      image,
      showingImage,
      darkMode,
      formatTask,
      slideItemToX,
    };
  },
  props: {
    task: {
      type: String,
      required: true,
    },
    photo: {
      type: ArrayBuffer,
      required: false,
    },
  },
  emits: ['self-delete', 'self-share', 'self-edit'],
  components: { OverlayCard },
};
</script>

<style lang="scss">
.item-container {
  position: relative;
  z-index: 1;
  margin-top: 1rem;
}
.item {
  border-radius: 0.25rem;
  padding: 0.5rem;
  box-shadow: 0 0 10px 0 rgba($color: #000000, $alpha: 0.1);
  border: 1px solid transparent;
  background-color: white;
  transition: border-color 400ms ease-out, background-color 400ms ease-out;
  &--dark {
    border-color: rgba($color: #ffffff, $alpha: 0.1);
    background-color: #1f2022;
  }
  &--show-right {
    transform: translateX(-100px);
  }

  &__heading {
    margin-bottom: 0.5rem;
  }

  &__content {
    display: grid;
    grid-template-columns: 70% auto;

    img {
      display: block;
      width: 90%;
      height: auto;
    }

    p {
      padding: 0 0.5rem;
      h1 {
        font-size: 1.2rem;
      }
      h2 {
        font-size: 1rem;
      }
      h3 {
        font-size: 0.8rem;
      }
      h4 {
        font-size: 0.6rem;
      }
      h5 {
        font-size: 0.4rem;
      }
      ul {
        padding-left: 1.25rem;
      }
    }
  }

  &__button {
    position: absolute;
    height: 100%;
    width: 200px;
    max-width: 50%;
    top: 0;
    z-index: -1;
    appearance: none;
    border: none;
    outline: none;
    box-shadow: inset 0 0 10px 0 rgba($color: #000000, $alpha: 0.5);
    padding: 0.5rem;
    border-radius: 0.25rem;

    &--share {
      left: 0;
      background-color: rgb(32, 76, 172);

      img {
        position: absolute;
        left: 27px;
        transform: translate(0, -55%);
        height: 50px;
        width: auto;
      }
    }

    &--delete {
      right: 0;
      background-color: rgb(167, 0, 0);

      &::after,
      &::before {
        content: '';
        position: absolute;
        right: 50px;
        height: 50%;
        background-color: white;
        width: 50px;
        height: 3px;
        border-radius: 0.25rem;
      }
      &::after {
        transform: translate(50%, 0) rotate(45deg);
      }
      &::before {
        transform: translate(50%, 0) rotate(-45deg);
      }
    }
  }
}
</style>
