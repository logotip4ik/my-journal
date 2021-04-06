<template>
  <transition name="slide-up">
    <div v-if="creatingTask" :class="{ 'create-card': true, 'create-card--dark': darkMode }">
      <div class="container">
        <div class="input-wrapper">
          <label>Class Name</label>
          <input
            v-model="newTask.className"
            ref="classNameInput"
            type="text"
            maxlength="50"
            @keypress.enter.prevent="$refs.taskInput.focus()"
          />
        </div>
        <div class="input-wrapper">
          <label>Task</label>
          <textarea
            v-model="newTask.task"
            ref="taskInput"
            type="text"
            maxlength="500"
            @input="resizeTextarea"
            @keypress.ctrl.enter.prevent="$refs.dateInput.focus()"
          />
        </div>
        <div class="input-wrapper">
          <label>Finish Date</label>
          <input
            v-model="newTask.finishDate"
            ref="dateInput"
            type="date"
            @keypress.enter.prevent="addNewTask"
          />
        </div>
        <div class="input-wrapper">
          <label>Photo</label>
          <div class="file-input">
            <label class="file-input__button">{{ newTask.photoName }}</label>
            <input
              class="file-input__input"
              type="file"
              accept="image/png, image/jpeg"
              @input="setImage"
              ref="image"
            />
            <transition name="fade">
              <button
                v-if="newTask.photoName !== 'Upload image'"
                class="file-input__clear"
                @click="setImage({ target: null })"
              >
                &times;
              </button>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { inject, ref, watch } from 'vue';

export default {
  name: 'TaskOverlay',
  setup() {
    const classNameInput = ref(null);
    const taskInput = ref(null);
    const photoInput = ref(null);

    const darkMode = inject('darkMode');
    const setImage = inject('setImage');
    const creatingTask = inject('creatingTask');
    const newTask = inject('newTask');
    const addNewTask = inject('addNewTask');
    const resetNewTask = inject('resetNewTask');

    function checkForKey(ev) {
      if (ev.target === document.body && ev.key === 'Escape') resetNewTask();
    }

    function resizeTextarea() {
      taskInput.value.style.height = 'auto';
      taskInput.value.style.height = `${taskInput.value.scrollHeight}px`;
    }

    watch(creatingTask, (value, oldValue) => {
      if (value && !oldValue) {
        setTimeout(() => {
          classNameInput.value.focus();
        }, 400);
        window.addEventListener('keyup', checkForKey);
      } else if (!value && oldValue) {
        window.removeEventListener('keyup', checkForKey);
      }
    });

    return {
      classNameInput,
      taskInput,
      photoInput,
      creatingTask,
      darkMode,
      setImage,
      newTask,
      addNewTask,
      resizeTextarea,
    };
  },
};
</script>

<style lang="scss" scoped>
.create-card {
  position: fixed;
  // SAME AS NAVBAR HEIGHT
  top: 56px;
  left: 0;
  z-index: 999;
  width: 100%;
  height: calc(100vh - 56px);
  padding: 0.25rem;
  background-color: white;
  box-shadow: 0 -5px 10px 0px rgba($color: #000000, $alpha: 0.25);
  transition: background-color 400ms ease-out;

  &--dark {
    background-color: #1f2022;

    .input-wrapper {
      label,
      input,
      textarea,
      button {
        border-bottom-color: rgb(212, 212, 212) !important;
        color: rgb(212, 212, 212) !important;
      }
      &:hover {
        label {
          color: white;
        }
        input,
        textarea {
          border-bottom-color: white;
        }
      }
      &::after {
        background-color: white;
      }
    }
  }
}

.container {
  max-width: 700px;
  margin: 1rem auto 0;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.input-wrapper {
  width: 100%;
  margin-bottom: 1.5rem;
  position: relative;
  &:hover {
    label {
      color: black;
    }
    input,
    textarea {
      border-bottom-color: black;
    }
  }
  &:focus-within {
    label {
      color: currentColor;
    }
    &::after {
      transform: scale(1);
    }
  }
  label:not(.file-input__button) {
    display: block;
    font-size: 1.1rem;
    color: #333;
    transition: color 200ms ease-out;
  }
  input:not(.file-input),
  textarea {
    appearance: none;
    background-color: transparent;
    border-radius: 0;
    border: none;
    border-bottom: 1px solid #333;
    transition: border-bottom-color 200ms ease-out, color 200ms ease-out;
    outline: none;
    box-shadow: none;
    font: inherit;
    font-size: 1.1rem;
    padding: 0.1rem;
    width: 100%;
  }
  textarea {
    resize: vertical;
  }
  .file-input {
    position: relative;
    display: inline-block;
    cursor: pointer;
    height: 2.5rem;
    width: 100%;

    &__button {
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      z-index: 5;
      height: 2.5rem;
      padding: 0.5rem 0.1rem;
      font: inherit;
      font-size: 1.1rem;
      line-height: 1.5;
      color: #333;
      background-color: transparent;
      border: none;
      border-bottom: 1px solid #333;
      border-radius: 0;
      user-select: none;
      pointer-events: none;
    }
    &__input {
      width: 100%;
      margin: 0;
      filter: alpha(opacity=0);
      opacity: 0;
      height: 100%;
    }
    &__clear {
      position: absolute;
      right: 0.25rem;
      top: 50%;
      transform: translateY(-50%);
      appearance: none;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      border: 1px solid #999;
      box-shadow: 0 0 10px 0 rgba($color: #000000, $alpha: 0.2);
      background-color: transparent;
      text-align: center;
    }
  }
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: black;
    transform: scale(0);
    transition: transform 300ms ease-out;
  }
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 400ms ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 300ms ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
