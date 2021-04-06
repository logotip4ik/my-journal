<template>
  <OverlayCard :value="showingEdit" :on-esc="resetEdit">
    <div class="input-wrapper">
      <label>Class Name</label><input v-model="editingTask.className" type="text" />
    </div>
    <div class="input-wrapper">
      <label>Task</label
      ><textarea v-model="editingTask.task" @input="resizeTextarea" type="text" ref="taskInput" />
    </div>
    <div class="input-wrapper">
      <label>Finish Date</label><input v-model="editingTask.finishDate" type="date" />
    </div>
    <div class="input-wrapper">
      <label>Photo</label>
      <div class="file-input">
        <label class="file-input__button">{{ editingTask.photoName }}</label>
        <input
          class="file-input__input"
          type="file"
          accept="image/png, image/jpeg"
          @input="setImageEditing"
          ref="image"
        />
        <transition name="fade">
          <button
            v-if="editingTask.photoName !== 'Upload image'"
            class="file-input__clear"
            @click="setImageEditing({ target: null })"
          >
            &times;
          </button>
        </transition>
      </div>
    </div>
    <div class="buttons">
      <transition name="fade">
        <button v-if="editingTask.photo" class="buttons__download" @click="downloadImage">
          Download Image
        </button>
      </transition>
      <button class="buttons__save" @click="saveEditingTask">Save</button>
      <button class="buttons__cancel" @click="resetEdit">Cancel</button>
    </div>
  </OverlayCard>
</template>

<script>
import { inject, ref, watch } from 'vue';

import OverlayCard from './Overlay-Card.vue';

export default {
  name: 'OverlayEdit',
  setup() {
    const card = ref(null);
    const taskInput = ref(null);

    const darkMode = inject('darkMode');
    const setImageEditing = inject('setImageEditing');
    const showingEdit = inject('showingEdit');
    const editingTask = inject('editingTask');
    const resetEdit = inject('resetEdit');
    const saveEditingTask = inject('saveEditingTask');

    function resizeTextarea() {
      taskInput.value.style.height = 'auto';
      taskInput.value.style.height = `${taskInput.value.scrollHeight}px`;
    }
    function convertImageToHref() {
      const typedArray = new Uint8Array(editingTask.value.photo);
      const blob = new Blob([typedArray], { type: 'image/jpeg' });
      return window.URL.createObjectURL(blob);
    }
    function downloadImage() {
      const link = document.createElement('a');
      link.href = convertImageToHref();
      link.download = true;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      link.remove();
      resetEdit();
    }

    watch(showingEdit, (val) => {
      if (val) setTimeout(resizeTextarea, 400);
    });

    return {
      showingEdit,
      editingTask,
      darkMode,
      resetEdit,
      setImageEditing,
      downloadImage,
      saveEditingTask,
      resizeTextarea,
      taskInput,
      card,
    };
  },
  components: {
    OverlayCard,
  },
};
</script>

<style lang="scss" scoped>
.card--dark {
  & > .input-wrapper {
    label,
    input,
    textarea,
    button {
      border-bottom-color: rgb(212, 212, 212);
      color: rgb(212, 212, 212);
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
  & .buttons {
    &__save {
      background-color: darken($color: white, $amount: 20);
      color: black;

      &:hover {
        background-color: white;
        color: black;
      }
    }
    &__cancel,
    &__download {
      background-color: transparent;
      color: white;

      &:hover {
        background-color: lighten($color: #1f2022, $amount: 10);
      }
    }
  }
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
  label {
    display: block;
    font-size: 1.1rem;
    color: #333;
    transition: color 200ms ease-out;
  }
  input,
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
      cursor: pointer;
    }
  }
  textarea {
    resize: vertical;
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

.buttons {
  display: flex;
  justify-content: flex-end;
  align-self: center;
  width: 100%;
  padding: 0.1rem 0.5rem;

  button {
    appearance: none;
    border: 1px solid #999;
    background-color: transparent;
    border-radius: 0.25rem;
    padding: 0.25rem 0.75rem;
    box-shadow: 0 0 10px 0 rgba($color: #000000, $alpha: 0.2),
      inset 0 0 10px 0 rgba($color: #000000, $alpha: 0.15);
    font: inherit;
    font-size: 1.1rem;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin: 0 0.25rem;
    transition: background-color 200ms ease-out, color 200ms ease-out;
    cursor: pointer;
    &:last-child {
      margin-right: 0;
    }
  }

  &__download {
    font-size: 0.6rem !important;
  }
  &__save {
    background-color: lighten($color: #1f2022, $amount: 10) !important;
    color: white !important;

    &:hover {
      background-color: #1f2022 !important;
      color: white !important;
    }
  }
  &__cancel:hover {
    background-color: darken($color: white, $amount: 10);
  }
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
