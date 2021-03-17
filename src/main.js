import { createApp, h } from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';

createApp({
  vuetify,
  render: () => h(App),
}).mount('#app');
