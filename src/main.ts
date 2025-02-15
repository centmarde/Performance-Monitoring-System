/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from "@/plugins";
import "vue-toastification/dist/index.css";
import VueSidebarMenu from "vue-sidebar-menu";
import "vue-sidebar-menu/dist/vue-sidebar-menu.css";
import Toast from "vue-toastification";
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net-dt";

//@ts-ignore
import { PerfectScrollbarPlugin } from 'vue3-perfect-scrollbar';
import 'vue3-perfect-scrollbar/style.css';
//@ts-ignore

DataTable.use(DataTablesCore);
// @ts-ignore
import App from "./App.vue";
// Router
import router from "./router"; // Import the router

// Composables
import { createApp } from "vue";

const app = createApp(App)
.use(Toast)
.use(PerfectScrollbarPlugin)

app.config.warnHandler = () => {};

app.use(VueSidebarMenu);

registerPlugins(app);

app.mount("#app");
