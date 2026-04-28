<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../api/api";
import headerBar from "../components/headerBar.vue";

const router = useRouter();

const usuario = ref(null);
const editando = ref(false);
const cargando = ref(false);
const error = ref("");
const mensaje = ref("");

const form = ref({
  nombre: "",
  password: "",
  imagenPerfil: ""
});

onMounted(() => {
  try {
    const userGuardado = localStorage.getItem("user");

    if (!userGuardado) {
      router.push("/login");
      return;
    }

    usuario.value = JSON.parse(userGuardado);

    form.value.nombre = usuario.value.nombre || "";
    form.value.imagenPerfil = usuario.value.imagenPerfil || "";
  } catch (error) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  }
});

const abrirEdicion = () => {
  error.value = "";
  mensaje.value = "";
  editando.value = true;

  form.value.nombre = usuario.value?.nombre || "";
  form.value.password = "";
  form.value.imagenPerfil = usuario.value?.imagenPerfil || "";
};

const cancelarEdicion = () => {
  editando.value = false;
  error.value = "";
  mensaje.value = "";
};

const cambiarImagen = (event) => {
  const archivo = event.target.files[0];

  if (!archivo) return;

  const reader = new FileReader();

  reader.onload = () => {
    form.value.imagenPerfil = reader.result;
  };

  reader.readAsDataURL(archivo);
};

const guardarCambios = async () => {
  error.value = "";
  mensaje.value = "";

  if (!form.value.nombre.trim()) {
    error.value = "El nombre no puede estar vacío.";
    return;
  }

  if (form.value.password && form.value.password.length < 6) {
    error.value = "La contraseña debe tener al menos 6 caracteres.";
    return;
  }

  try {
    cargando.value = true;

    const payload = {
      nombre: form.value.nombre.trim(),
      imagenPerfil: form.value.imagenPerfil
    };

    if (form.value.password.trim()) {
      payload.password = form.value.password.trim();
    }

    const { data } = await api.put("/auth/me", payload);

    usuario.value = data.user;
    localStorage.setItem("user", JSON.stringify(data.user));

    mensaje.value = "Perfil actualizado correctamente.";
    editando.value = false;
  } catch (err) {
    console.error(err);
    error.value =
      err?.response?.data?.msg || "No se pudo actualizar el perfil.";
  } finally {
    cargando.value = false;
  }
};

const cerrarSesion = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  router.push("/");
  window.location.reload();
};
</script>

<template>
  <headerBar />

  <section class="cuenta-page">
    <div class="profile-card">
      <p class="eyebrow">WE TRIP</p>
      <h1>Mi cuenta</h1>

      <div v-if="usuario" class="profile-content">
        <div class="avatar">
          <img
            v-if="usuario.imagenPerfil"
            :src="usuario.imagenPerfil"
            alt="Imagen de perfil"
          />
          <span v-else>
            {{ usuario.nombre?.charAt(0).toUpperCase() || "U" }}
          </span>
        </div>

        <template v-if="!editando">
          <div class="user-data">
            <div class="data-row">
              <span>Nombre</span>
              <strong>{{ usuario.nombre }}</strong>
            </div>

            <div class="data-row">
              <span>Email</span>
              <strong>{{ usuario.email }}</strong>
            </div>
          </div>

          <p v-if="mensaje" class="success-message">
            {{ mensaje }}
          </p>

          <div class="actions">
            <button class="edit-btn" @click="abrirEdicion">
              Gestionar cuenta
            </button>

            <button class="logout-btn" @click="cerrarSesion">
              Cerrar sesión
            </button>
          </div>
        </template>

        <template v-else>
          <div class="edit-form">
            <div class="field">
              <label for="imagen">Imagen de perfil</label>
              <input
                id="imagen"
                type="file"
                accept="image/*"
                @change="cambiarImagen"
              />
            </div>

            <div class="preview-avatar">
              <img
                v-if="form.imagenPerfil"
                :src="form.imagenPerfil"
                alt="Vista previa"
              />
              <span v-else>
                {{ form.nombre?.charAt(0).toUpperCase() || "U" }}
              </span>
            </div>

            <div class="field">
              <label for="nombre">Nombre</label>
              <input
                id="nombre"
                v-model="form.nombre"
                type="text"
                placeholder="Tu nombre"
              />
            </div>

            <div class="field">
              <label for="password">Nueva contraseña</label>
              <input
                id="password"
                v-model="form.password"
                type="password"
                placeholder="Déjala vacía si no quieres cambiarla"
              />
            </div>

            <p v-if="error" class="error-message">
              {{ error }}
            </p>

            <div class="actions">
              <button
                class="save-btn"
                @click="guardarCambios"
                :disabled="cargando"
              >
                {{ cargando ? "Guardando..." : "Guardar cambios" }}
              </button>

              <button class="cancel-btn" @click="cancelarEdicion">
                Cancelar
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cuenta-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 40px 24px 60px;
  background:
    radial-gradient(circle at top left, rgba(59, 130, 246, 0.12), transparent 28%),
    linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%);
}

.profile-card {
  width: 100%;
  max-width: 760px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid #dbeafe;
  border-radius: 28px;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
  text-align: center;
}

.eyebrow {
  margin: 0 0 8px;
  color: #2563eb;
  font-weight: 800;
  letter-spacing: 0.08em;
}

h1 {
  margin: 0 0 28px;
  color: #0f172a;
  font-size: 2.2rem;
}

.profile-content {
  display: grid;
  gap: 24px;
}

.avatar,
.preview-avatar {
  width: 96px;
  height: 96px;
  margin: 0 auto;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #dbeafe;
  color: #1d4ed8;
  font-size: 2rem;
  font-weight: 900;
  overflow: hidden;
}

.avatar img,
.preview-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-data {
  display: grid;
  gap: 14px;
}

.data-row {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  padding: 18px;
  border-radius: 18px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  text-align: left;
}

.data-row span {
  color: #64748b;
  font-weight: 700;
}

.data-row strong {
  color: #0f172a;
  text-align: right;
}

.edit-form {
  display: grid;
  gap: 18px;
  text-align: left;
}

.field {
  display: grid;
  gap: 8px;
}

.field label {
  color: #334155;
  font-weight: 700;
}

.field input {
  min-height: 52px;
  padding: 13px 16px;
  border-radius: 16px;
  border: 1px solid #dbeafe;
  background: #f8fafc;
  color: #0f172a;
  font-size: 0.98rem;
  outline: none;
}

.field input:focus {
  border-color: #60a5fa;
  background: white;
  box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.14);
}

.actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.edit-btn,
.save-btn {
  border: none;
  border-radius: 16px;
  padding: 15px 24px;
  background: #2563eb;
  color: white;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
}

.logout-btn {
  border: none;
  border-radius: 16px;
  padding: 15px 24px;
  background: #dc2626;
  color: white;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
}

.cancel-btn {
  border: none;
  border-radius: 16px;
  padding: 15px 24px;
  background: #e2e8f0;
  color: #0f172a;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
}

.save-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

.error-message {
  color: #b91c1c;
  font-weight: 700;
  text-align: center;
}

.success-message {
  color: #15803d;
  font-weight: 700;
  text-align: center;
}

@media (max-width: 640px) {
  .profile-card {
    padding: 30px 20px;
  }

  .data-row,
  .actions {
    grid-template-columns: 1fr;
  }

  .data-row {
    flex-direction: column;
    gap: 6px;
    text-align: center;
  }

  .data-row strong {
    text-align: center;
  }
}
</style>