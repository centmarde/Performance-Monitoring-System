import { createRouter, createWebHistory } from 'vue-router/auto';
import { setupLayouts } from 'virtual:generated-layouts';
import { useAuthUserStore } from '../stores/authUser';
import { useToast } from 'vue-toastification';

import Hero from '@/pages/index.vue';
import Home from '@/pages/Home.vue';
import NotFound from '@/pages/NotFound.vue';
import Admin from '@/pages/Admin.vue';
import Profiles from '@/pages/Profiles.vue';

const toast = useToast();

const routes = setupLayouts([
  { path: '/', component: Hero },
  { path: '/home', component: Home, name: 'Home', meta: { requiresAuth: true, role: 'teacher' } },
  { path: '/admin', component: Admin, name: 'Admin', meta: { requiresAuth: true, role: 'admin' } },
  { path: '/profiles', component: Profiles, name: 'Profiles', meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', component: NotFound, name: 'NotFound' },
]);

const router = createRouter({
  history: createWebHistory("/"),
  routes,
});



router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem("access_token") !== null;
  const userRole = localStorage.getItem("Role");
  const publicPages = ["/", "/login"];
  const protectedPages = ["/home", "/profiles"];

  if (to.meta.requiresAuth && !isLoggedIn) {
    toast.error("Authentication is required to access this page.");
    return next("/");
  }

  if (publicPages.includes(to.path) && isLoggedIn) {
    return next(userRole === 'admin' ? "/admin" : "/home");
  }

  if (to.meta.role && to.meta.role !== userRole) {
    return next(userRole === 'admin' ? "/admin" : "/home");
  }

  if (userRole === 'admin' && to.path !== '/admin') {
    return next('/admin');
  }

  if (userRole !== 'admin' && to.path === '/admin') {
    return next('/home');
  }

  next();
});

router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error');
      localStorage.setItem('vuetify:dynamic-reload', 'true');
      location.assign(to.fullPath);
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err);
    }
  } else {
    console.error(err);
  }
});

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload');
});

export default router;
