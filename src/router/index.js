/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from "vue-router";
import Home from "@/pages/Home.vue";
import login from "@/components/autenticate/login.vue";
import addresses from "@/components/addresses/addresses.vue";

function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const exp = payload.exp;
    const now = Math.floor(Date.now() / 1000);
    return exp < now;
  } catch (e) {
    return true;
  }
}

const routes = [
  {
    path: "/",
    component: Home,
    meta: { requiresAuth: true, title: "Home" },
  },
  {
    path: "/login",
    component: login,
    meta: { title: "Login" },
  },
  {
    path: "/addresses",
    component: addresses,
    meta: { title: "Endereços" },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const defaultTitle = "Login";
  document.title = to.meta.title || defaultTitle;

  const token = localStorage.getItem("token");

  if (to.meta.requiresAuth) {
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("token"); // remove o token inválido
      next("/login");
    } else {
      next();
    }
  } else if (to.path === "/login" && token && !isTokenExpired(token)) {
    next("/");
  } else {
    next();
  }
});

// Workaround for https://github.com/vitejs/vite/issues/11804
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
