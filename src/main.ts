/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'
import "vue-toastification/dist/index.css";
import VueSidebarMenu from 'vue-sidebar-menu'
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'
import Toast from "vue-toastification";
// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

const app = createApp(App).use(Toast);

// app.config.warnHandler = () => {};

app.use(VueSidebarMenu);

registerPlugins(app)

app.mount('#app')
