/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from "vue-router";
import Home from "@/pages/Home.vue";
import login from "@/components/autenticate/login.vue";
//import { meta } from "eslint-plugin-vue";
//import DetailUser from "@/components/DetailUser.vue";

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
  /*{
    path: "/detalhes",
    component: DetailUser,
  },*/
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const defaultTitle = "Login";
  document.title = to.meta.title || defaultTitle;
  const token = localStorage.getItem("token");

  if (to.meta.requiresAuth && !token) {
    // Se a rota precisa de autenticação e o usuário não tem token, redireciona
    next("/login");
  } else if (to.path === "/login" && token) {
    // Se está logado e tenta ir pro login, manda pra home
    next("/");
  } else {
    // Tudo certo, segue
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
