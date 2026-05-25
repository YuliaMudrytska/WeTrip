<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const menuAbierto = ref(false);
const perfilAbierto = ref(false);

let usuarioInicial = null;

try {
  const usuarioGuardado = localStorage.getItem("user");
  usuarioInicial = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
} catch (error) {
  usuarioInicial = null;
}

const usuario = ref(usuarioInicial);
const usuarioLogueado = ref(!!usuario.value);

const toggleMenu = () => {
  menuAbierto.value = !menuAbierto.value;
  if (menuAbierto.value) {
    perfilAbierto.value = false;
  }
};

const togglePerfil = () => {
  perfilAbierto.value = !perfilAbierto.value;
  if (perfilAbierto.value) {
    menuAbierto.value = false;
  }
};

const cerrarPaneles = () => {
  menuAbierto.value = false;
  perfilAbierto.value = false;
};

const navegar = (ruta) => {
  router.push(ruta);
  cerrarPaneles();
};

const cerrarSesion = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  cerrarPaneles();
  router.push("/");
  window.location.reload();
};
</script>

<template>
  <header class="header">
    <div class="header-inner">
      <button class="icon-btn" @click="toggleMenu" aria-label="Abrir menú">
        <span v-if="!menuAbierto">☰</span>
        <span v-else>✕</span>
      </button>

      <button class="brand" @click="navegar('/')">
        WE TRIP
      </button>

      <div class="header-actions">
        <button class="icon-btn" @click="navegar('/')" aria-label="Buscar">
          🔍
        </button>

        <button class="icon-btn profile-icon-btn" @click="togglePerfil" aria-label="Perfil">
          <img
            v-if="usuario?.imagenPerfil"
            :src="usuario.imagenPerfil"
            alt="Perfil"
            class="header-profile-img"
          />
          <span v-else>👤</span>
        </button>
      </div>
    </div>

    <transition name="fade-slide">
      <div v-if="menuAbierto" class="menu-panel">
        <button class="menu-item" @click="navegar('/favoritos')">Favoritos</button>
        <button class="menu-item" @click="navegar('/propuestas')">Mis Propuestas</button>
        <button class="menu-item" @click="navegar('/reservados')">Reservados</button>
        <button class="menu-item" @click="navegar('/realizados')">Planes realizados</button>
       <!-- <button class="menu-item" @click="navegar('/notificaciones')">Notificaciones</button>
        <button class="menu-item" @click="navegar('/novedades')">Novedades</button>-->
      </div>
    </transition>

    <transition name="fade-slide">
      <div v-if="perfilAbierto" class="profile-panel">
        <template v-if="usuarioLogueado">
          <div class="profile-user">

            <div class="profile-avatar">
              <img
                v-if="usuario?.imagenPerfil"
                :src="usuario.imagenPerfil"
                alt="Imagen de perfil"
              />
              <span v-else>👤</span>
            </div>
            
            <div>
              <p class="profile-name">{{ usuario && usuario.nombre }}</p>
              <p class="profile-subtitle">Cuenta activa</p>
            </div>
          </div>

          <button class="profile-item" @click="navegar('/cuenta')">
            Gestionar cuenta
          </button>

          <button class="profile-item" @click="navegar('/registro')">
            Añadir cuenta
          </button>


          <button class="profile-item logout" @click="cerrarSesion">
            Cerrar sesión
          </button>
        </template>

        <template v-else>
          <button class="profile-item" @click="navegar('/login')">
            LogIn
          </button>

          <button class="profile-item" @click="navegar('/registro')">
            Registrarte
          </button>
        </template>
      </div>
    </transition>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  width: 100%;
  padding: 16px 24px 0;
  background: transparent;
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  min-height: 74px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 16px;
  padding: 12px 18px;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(219, 234, 254, 0.95);
  border-radius: 22px;
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.08);
}

.brand {
  justify-self: center;
  border: none;
  background: transparent;
  color: #0f172a;
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  cursor: pointer;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.icon-btn {
  width: 46px;
  height: 46px;
  border: none;
  border-radius: 14px;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 1.15rem;
  cursor: pointer;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
  transition: transform 0.2s ease, background 0.2s ease;
}

.profile-icon-btn {
  overflow: hidden;
  padding: 0;
}

.header-profile-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-avatar {
  overflow: hidden;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.icon-btn:hover {
  transform: translateY(-1px);
  background: #dbeafe;
}

.menu-panel,
.profile-panel {
  max-width: 1200px;
  margin: 12px auto 0;
  padding: 12px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(219, 234, 254, 0.95);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
}

.menu-panel {
  display: grid;
  gap: 10px;
}

.profile-panel {
  max-width: 420px;
  margin-left: auto;
  margin-right: calc((100% - min(1200px, 100%)) / 2);
  display: grid;
  gap: 10px;
}

.menu-item,
.profile-item {
  min-height: 50px;
  border: none;
  border-radius: 14px;
  background: #f8fafc;
  color: #334155;
  font-size: 1rem;
  font-weight: 700;
  text-align: left;
  padding: 0 16px;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
}

.menu-item:hover,
.profile-item:hover {
  background: #eff6ff;
  transform: translateX(2px);
}

.profile-user {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 10px 18px;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 4px;
}

.profile-avatar {
  width: 54px;
  height: 54px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #dbeafe;
  color: #1d4ed8;
  font-size: 1.4rem;
  font-weight: 700;
}

.profile-name {
  margin: 0;
  color: #0f172a;
  font-size: 1.05rem;
  font-weight: 800;
}

.profile-subtitle {
  margin: 4px 0 0;
  color: #64748b;
  font-size: 0.92rem;
}

.logout {
  background: #fff5f5;
  color: #b91c1c;
}

.logout:hover {
  background: #fee2e2;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.22s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (max-width: 640px) {
  .header {
    padding: 14px 14px 0;
  }

  .header-inner {
    grid-template-columns: auto 1fr auto;
    padding: 10px 12px;
    gap: 10px;
  }

  .brand {
    font-size: 1rem;
  }

  .icon-btn {
    width: 42px;
    height: 42px;
    border-radius: 12px;
  }

  .profile-panel {
    max-width: 100%;
    margin-right: auto;
  }
}
</style>