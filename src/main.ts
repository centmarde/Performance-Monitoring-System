/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App
 */

// Vue & Core Dependencies
import { createApp } from "vue";
import App from "./App.vue";

import router from "./router";

import { registerPlugins } from "@/plugins";
import VueSidebarMenu from "vue-sidebar-menu";
import "vue-sidebar-menu/dist/vue-sidebar-menu.css";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net-dt";
import "@/styles/styles.css";
import "@/styles/logout.css";

import { PerfectScrollbarPlugin } from "vue3-perfect-scrollbar";
import "vue3-perfect-scrollbar/style.css";

DataTable.use(DataTablesCore);

// Toast Configuration
const toastOptions = {
  toastClassName: "custom-toast", // Custom styling
  position: "top-right",
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  hideProgressBar: false,
  transition: "Vue-Toastification__fade",
};

const app = createApp(App)
  .use(router)
  .use(Toast, toastOptions)
  .use(PerfectScrollbarPlugin)
  .use(VueSidebarMenu);

app.config.warnHandler = () => {};

registerPlugins(app);
app.mount("#app");
