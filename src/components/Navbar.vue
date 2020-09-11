<template>
  <v-app-bar
    app
    dark
    fixed
    :color="dark ? 'grey darken-4' : 'primary'">
    <v-toolbar-title>
      Journal
    </v-toolbar-title>
    <v-spacer />
    <div>
      <v-btn icon @click="$emit('add-task')">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </div>
  </v-app-bar>
</template>

<script>
export default {
  name: 'Navbar',
  props: {
    dark: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
};
</script>
