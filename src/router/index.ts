import { createRouter, createWebHistory } from "vue-router/auto";
import { setupLayouts } from "virtual:generated-layouts";
import { useAuthUserStore } from "../stores/authUser";
import { useToast } from "vue-toastification";

// @ts-ignore
import TeachersPage from "@/pages/admin/TeachersPage.vue";
// @ts-ignore
import Hero from "@/pages/index.vue";
// @ts-ignore
import Home from "@/pages/home/Home.vue";
// @ts-ignore
import NotFound from "@/pages/NotFound.vue";
// @ts-ignore
import Admin from "@/pages/admin/Admin.vue";
// @ts-ignore
import Profiles from "@/pages/home/Profiles.vue";
// @ts-ignore
import DataEntry from "@/pages/home/DataEntry.vue";
// @ts-ignore
import Tracking from "@/pages/home/Tracking.vue";
// @ts-ignore
import Welcome from "@/pages/Welcome.vue";
// @ts-ignore
import NewRecords from "@/pages/home/NewRecords.vue";
// @ts-ignore
import RecentRecords from "@/pages/home/RecentRecords.vue";
// @ts-ignore
import SectionTracking from "@/pages/home/SectionTracking.vue";
// @ts-ignore
import AdminPorfiles from "@/pages/admin/AdminProfiles.vue";

const toast = useToast();

const routes = setupLayouts([
  { path: "/", component: Hero },
  { path: "/newrecords", component: NewRecords, meta: { requiresAuth: true } },
  {
    path: "/recentrecords",
    component: RecentRecords,
    meta: { requiresAuth: true },
  },
  { path: "/welcome", component: Welcome, meta: { requiresAuth: true } },
  {
    path: "/home",
    component: Home,
    name: "Home",
    meta: { requiresAuth: true, role: "teacher" },
  },
  {
    path: "/admin",
    component: Admin,
    name: "Admin",
    meta: { requiresAuth: true, role: "admin" },
  },
  {
    path: "/profiles",
    component: Profiles,
    name: "Profiles",
    meta: { requiresAuth: true, role: "teacher" },
  },
  {
    path: "/teachers",
    component: TeachersPage,
    name: "Teachers",
    meta: { requiresAuth: true, role: "admin" },
  },

  {
    path: "/data_entry",
    component: DataEntry,
    name: "data_entry",
    meta: { requiresAuth: true, role: "teacher" },
  },
  {
    path: "/tracking",
    component: Tracking,
    name: "tracking",
    meta: { requiresAuth: true, role: "teacher" },
  },
  {
    path: "/admin_profiles",
    component: AdminPorfiles,
    name: "admin_profiles",
    meta: { requiresAuth: true, role: "admin" },
  },
  {
    path: "/section_tracking",
    component: SectionTracking,
    name: "section_tracking",
    meta: { requiresAuth: true, role: "teacher" },
  },
  { path: "/:pathMatch(.*)*", component: NotFound, name: "NotFound" },
]);

const router = createRouter({
  history: createWebHistory("/"),
  routes,
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem("access_token") !== null;
  const userRole = localStorage.getItem("Role");
  const publicPages = ["/", "/login"];

  const adminPages = [
    "/admin",
    "/teachers",
    "/teacher_account",
    "/admin_profiles",
  ];
  // const protectedPages = ["/home", "/profiles", "/admin", "/teachers", "/teacher_account"];

  if (to.meta.requiresAuth && !isLoggedIn) {
    toast.error("Authentication is required to access this page.");
    return next("/");
  }

  if (publicPages.includes(to.path) && isLoggedIn) {
    return next(userRole === "admin" ? "/admin" : "/home");
  }

  if (to.meta.role && to.meta.role !== userRole) {
    return next(userRole === "admin" ? "/admin" : "/home");
  }

  if (userRole === "admin" && !adminPages.includes(to.path)) {
    return next("/admin");
  }

  if (userRole !== "admin" && adminPages.includes(to.path)) {
    return next("/home");
  }

  next();
});

router.onError((err, to) => {
  if (err?.message?.includes?.("Failed to fetch dynamically imported module")) {
    if (!localStorage.getItem("vuetify:dynamic-reload")) {
      console.log("Reloading page to fix dynamic import error");
      localStorage.setItem("vuetify:dynamic-reload", "true");
      location.assign(to.fullPath);
    } else {
      console.error("Dynamic import error, reloading page did not fix it", err);
    }
  } else {
    console.error(err);
  }
});

router.isReady().then(() => {
  localStorage.removeItem("vuetify:dynamic-reload");
});

export default router;
