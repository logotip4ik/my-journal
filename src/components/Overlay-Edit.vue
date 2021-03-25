<template>
  <OverlayCard :value="showingEdit" :onEsc="resetEdit">
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
    <div class="buttons">
      <button class="buttons__save" @click="saveEditingTask">Save</button>
      <button class="buttons__cancel" @click="resetEdit">Cancel</button>
    </div>
  </OverlayCard>
</template>

<script>
import { inject, ref } from 'vue';

import OverlayCard from './Overlay-Card.vue';

export default {
  name: 'OverlayEdit',
  setup() {
    const card = ref(null);
    const taskInput = ref(null);

    const darkMode = inject('darkMode');
    const showingEdit = inject('showingEdit');
    const editingTask = inject('editingTask');
    const resetEdit = inject('resetEdit');
    const saveEditingTask = inject('saveEditingTask');

    function resizeTextarea() {
      taskInput.value.style.height = 'auto';
      taskInput.value.style.height = `${taskInput.value.scrollHeight}px`;
    }

    return {
      showingEdit,
      editingTask,
      darkMode,
      resetEdit,
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
    textarea {
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
    &__cancel {
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
  align-self: flex-end;
  padding: 0.1rem 0.5rem;

  * {
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

  &__save {
    background-color: lighten($color: #1f2022, $amount: 10);
    color: white;

    &:hover {
      background-color: #1f2022;
      color: white;
    }
  }
  &__cancel:hover {
    background-color: darken($color: white, $amount: 10);
  }
}
</style>
