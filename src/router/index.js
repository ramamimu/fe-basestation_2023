import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/nasional",
      name: "nasional",
      component: () => import("../views/Nasional.vue"),
    },
    ,
    {
      path: "/regional",
      name: "Regional",
      component: () => import("../views/Regional.vue"),
    },
    {
      path: "/tianjin",
      name: "Tianjin",
      component: () => import("../views/Tianjin.vue"),
    },
    {
      path: "/history",
      name: "History",
      component: () => import("../views/History.vue"),
    },
  ],
});

export default router;
