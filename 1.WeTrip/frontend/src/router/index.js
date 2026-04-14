import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../views/homeView.vue";
import FormView from "../views/formView.vue";
import PlanesView from "../views/planesView.vue";
import FavoritosView from "../views/favoritosView.vue";
import ReservadosView from "../views/reservadosView.vue";
import NotificacionesView from "../views/notificacionesView.vue";
import NovedadesView from "../views/novedadesView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/registroView.vue";
import CuentaView from "../views/cuentaView.vue";
import RealizadosView from "../views/realizadosView.vue";

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
  },
  {
    path: "/favoritos",
    name: "favoritos",
    component: FavoritosView
  },
  {
    path: "/reservados",
    name: "reservados",
    component: ReservadosView
  },
  {
    path: "/notificaciones",
    name: "notificaciones",
    component: NotificacionesView
  },
  {
    path: "/novedades",
    name: "novedades",
    component: NovedadesView
  },
  {
    path: "/login",
    name: "login",
    component: LoginView
  },
  {
    path: "/registro",
    name: "registro",
    component: RegisterView
  },
  {
    path: "/cuenta",
    name: "cuenta",
    component: CuentaView
  },
  {
  path: "/realizados",
  name: "realizados",
  component: RealizadosView
}
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;