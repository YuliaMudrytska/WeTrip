import { createRouter, createWebHistory } from "vue-router";

import homeView from "../views/homeView.vue";
import formView from "../views/formView.vue";
import planesView from "../views/planesView.vue";
import favoritosView from "../views/favoritosView.vue";
import reservadosView from "../views/reservadosView.vue";
import realizadosView from "../views/realizadosView.vue";
import notificacionesView from "../views/notificacionesView.vue";
import novedadesView from "../views/novedadesView.vue";
import logInView from "../views/logInView.vue";
import registroView from "../views/registroView.vue";
import cuentaView from "../views/cuentaView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: homeView
  },
  {
    path: "/formulario",
    name: "formulario",
    component: formView
  },
  {
    path: "/planes",
    name: "planes",
    component: planesView
  },
  {
    path: "/propuestas",
    name: "propuestas",
    component: () => import("../views/propuestasView.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: "/propuesta/:id",
    name: "propuesta",
    component: () => import("../views/propuestaView.vue")
  },
  {
    path: "/favoritos",
    name: "favoritos",
    component: favoritosView,
    meta: { requiresAuth: true }
  },
  {
    path: "/reservados",
    name: "reservados",
    component: reservadosView,
    meta: { requiresAuth: true }
  },
  {
    path: "/realizados",
    name: "realizados",
    component: realizadosView,
    meta: { requiresAuth: true }
  },
  {
    path: "/notificaciones",
    name: "notificaciones",
    component: notificacionesView,
    meta: { requiresAuth: true }
  },
  {
    path: "/novedades",
    name: "novedades",
    component: novedadesView
  },
  {
    path: "/login",
    name: "login",
    component: logInView,
    meta: { guestOnly: true }
  },
  {
    path: "/registro",
    name: "registro",
    component: registroView,
    meta: { guestOnly: true }
  },
  {
    path: "/cuenta",
    name: "cuenta",
    component: cuentaView,
    meta: { requiresAuth: true }
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/"
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const estaLogueado = !!token;

  // Rutas que requieren autenticación
  if (to.meta.requiresAuth && !estaLogueado) {
    next("/login");
    return;
  }

  // Rutas solo para invitados
  if (to.meta.guestOnly && estaLogueado) {
    next("/");
    return;
  }

  next();
});

export default router;