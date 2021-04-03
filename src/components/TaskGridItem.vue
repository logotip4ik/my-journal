<template>
  <li class="item-container">
    <button class="item__button item__button--share" @click="$emit('self-share'), slideItemToX(0)">
      <img src="@/assets/reply-white-18dp.svg" alt="reply image" />
    </button>
    <div :class="{ item: true, 'item--dark': darkMode }" ref="item">
      <h2 class="item__heading"><slot></slot></h2>
      <p v-html="formatTask(task)"></p>
      <img v-if="photo" :src="photo" />
    </div>
    <button class="item__button item__button--delete" @click="$emit('self-delete')"></button>
  </li>
</template>

<script>
import { inject, onMounted, ref } from 'vue';
import Hammer from 'hammerjs';
import gsap from 'gsap';
import DOMpurify from 'dompurify';
import marked from 'marked';

export default {
  name: 'TaskGridItem',
  setup(_, { emit }) {
    const item = ref(null);
    const image = ref(null);
    const darkMode = inject('darkMode');

    function formatTask(task) {
      const t = DOMpurify.sanitize(task);
      return marked(t, { headerIds: false });
    }
    function slideItemToX(x) {
      gsap.to(item.value, {
        translateX: `${x}px`,
        duration: 0.3,
      });
    }
    function initHammer() {
      const hammertime = new Hammer.Manager(item.value);

      hammertime.add(new Hammer.Tap({ event: 'doubletap', taps: 2 }));
      hammertime.add(new Hammer.Pan({ direction: Hammer.DIRECTION_HORIZONTAL, threshold: 0 }));

      hammertime.on('doubletap', () => {
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
      hammertime.on('hammer.input', ({ isFinal, deltaX }) => {
        if (isFinal) {
          if (deltaX < -50) {
            slideItemToX(-100);
          } else if (deltaX > 50) {
            slideItemToX(100);
          } else if (deltaX < 50 && deltaX > -50) {
            slideItemToX(0);
          }
        }
      });
    }

    onMounted(() => {
      initHammer();
    });

    return {
      item,
      image,
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
      type: String,
      required: false,
    },
  },
  emits: ['self-delete', 'self-share', 'self-edit'],
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
