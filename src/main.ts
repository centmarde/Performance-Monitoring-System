/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

const app = createApp(App)

app.config.warnHandler = function (msg, vm, trace) {
    // Suppress all warnings
    return;
  };
  
registerPlugins(app)

app.mount('#app')
