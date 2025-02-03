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

// Token check interval every 5 seconds
let previousToken = localStorage.getItem('access_token'); // Store the previous token
setInterval(() => {
  const token = localStorage.getItem('access_token');
  const currentPath = router.currentRoute.value.path; // Get current route path

  if (token !== previousToken) { // Check if the token has changed
    previousToken = token; // Update the previous token
    if (token === null && currentPath !== '/') {
      toast.error('Your session has expired.');
      router.push('/');
    } else {
      toast.success('Session refreshed.'); // Notify user of token change
    }
  }
}, 5000);

// router.beforeEach((to, from, next) => {
//   const isLoggedIn = localStorage.getItem("access_token") !== null;
//   const userRole = localStorage.getItem("user_type");
//   const publicPages = ["/"];

//   if (to.meta.requiresAuth && !isLoggedIn) {
//     toast.error("Authentication is required to access this page.");
//     return next("/");
//   }

//   if (publicPages.includes(to.path) && isLoggedIn) {
//     return next(userRole === 'admin' ? "/admin" : "/home");
//   }

//   if (to.meta.role && to.meta.role !== userRole) {
//    /*  toast.error("You do not have permission to access this page."); */
//     return next(userRole === 'admin' ? "/admin" : "/home");
//   }

//   next();
// });

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
