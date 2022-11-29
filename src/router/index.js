import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/Nasional.vue"),
    },
    ,
  {
    path: "/regional",
    name: "Regional",
    component: () => import("../views/Regional.vue"),
  },
  ],
});

export default router;
