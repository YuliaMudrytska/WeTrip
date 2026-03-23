import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../views/homeView.vue";
import FormView from "../views/formView.vue";
import PlanesView from "../views/planesView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView
  },
  {
    path: "/formulario",
    name: "formulario",
    component: FormView
  },
  {
    path: "/planes",
    name: "planes",
    component: PlanesView
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;