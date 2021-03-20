<template>
  <li class="item-container">
    <!-- <button class="item__button item__button--share"></button> -->
    <div :class="{ item: true, 'item--dark': darkMode }" ref="item">
      <h2 class="item__heading"><slot></slot></h2>
      <p v-html="$slots.task()[0].children"></p>
    </div>
    <button class="item__button item__button--delete" @click="$emit('selfDelete')"></button>
  </li>
</template>

<script>
import { inject, onMounted, ref } from 'vue';
import Hammer from 'hammerjs';
import gsap from 'gsap';

export default {
  name: 'TaskGridItem',
  setup() {
    const item = ref(null);
    let hammertime;
    let globalDeltaX;

    const darkMode = inject('darkMode');

    function slideItemToX(x) {
      gsap.fromTo(
        item.value,
        {
          translateX: `${globalDeltaX}px`,
        },
        {
          translateX: `${x}px`,
          onComplete: () => {
            globalDeltaX = x;
          },
        },
      );
    }

    onMounted(() => {
      hammertime = new Hammer(item.value);
      hammertime.on('panstart panmove', ({ deltaX }) => {
        if (deltaX > -100 && deltaX < 100) {
          globalDeltaX = deltaX;
          item.value.style.transform = `translate3d(${deltaX}px, 0, 0)`;
        } else {
          const overDeltaX = (deltaX < 0 ? -100 : 100) + deltaX * 0.075;
          item.value.style.transform = `translate3d(${overDeltaX}px, 0, 0)`;
          globalDeltaX = overDeltaX;
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
    });

    return {
      item,
      darkMode,
    };
  },
  emits: ['selfDelete'],
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
  transition: border-color 400ms ease-out;
  background-color: white;
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
  }

  &__button {
    position: absolute;
    height: 100%;
    width: 200px;
    top: 0;
    z-index: -1;
    appearance: none;
    border: none;
    outline: none;
    box-shadow: inset 0 0 10px 0 rgba($color: #000000, $alpha: 0.5);
    padding: 0.5rem;
    border-radius: 0.25rem;

    &--delete {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      padding-left: 0;
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
