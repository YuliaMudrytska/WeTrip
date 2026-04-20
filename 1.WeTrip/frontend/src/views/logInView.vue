<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../api/api";

const router = useRouter();

const form = ref({
  email: "",
  password: ""
});

const cargando = ref(false);
const error = ref("");

const iniciarSesion = async () => {
  error.value = "";

  if (!form.value.email.trim() || !form.value.password.trim()) {
    error.value = "Completa todos los campos.";
    return;
  }

  try {
    cargando.value = true;

    const { data } = await api.post("/auth/login", {
      email: form.value.email.trim().toLowerCase(),
      password: form.value.password
    });

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    router.push("/");
    window.location.reload();
  } catch (err) {
    console.error(err);
    error.value =
      err?.response?.data?.msg || "No se pudo iniciar sesión.";
  } finally {
    cargando.value = false;
  }
};
</script>

<template>
  <section class="auth-page">
    <div class="auth-card">
      <p class="eyebrow">WE TRIP</p>
      <h1>LogIn</h1>
      <div class="form-grid">
        <div class="field">
          <label for="email">Correo electrónico</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="correo@ejemplo.com"
            @keyup.enter="iniciarSesion"
          />
        </div>

        <div class="field">
          <label for="password">Contraseña</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            placeholder="Introduce tu contraseña"
            @keyup.enter="iniciarSesion"
          />
        </div>
      </div>

      <p v-if="error" class="error-message">{{ error }}</p>

      <div class="actions">
        <button class="primary-btn" @click="iniciarSesion" :disabled="cargando">
          {{ cargando ? "Entrando..." : "Entrar" }}
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  padding: 40px 24px 60px;
  display: grid;
  place-items: center;
  background:
    radial-gradient(circle at top left, rgba(59, 130, 246, 0.12), transparent 28%),
    linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%);
}

.auth-card {
  width: 100%;
  max-width: 620px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid #dbeafe;
  border-radius: 28px;
  padding: 32px;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
}

.eyebrow {
  margin: 0 0 8px;
  color: #2563eb;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-align: center;
}

h1 {
  margin: 0 0 12px;
  font-size: 2.2rem;
  color: #0f172a;
  text-align: center;
}

.auth-text {
  margin: 0 0 24px;
  color: #475569;
  line-height: 1.6;
  text-align: center;
}

.form-grid {
  display: grid;
  gap: 18px;
}

.field {
  display: flex;
  flex-direction: column;
}

.field label {
  margin-bottom: 8px;
  color: #334155;
  font-weight: 700;
}

.field input {
  min-height: 54px;
  padding: 14px 16px;
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

.error-message {
  margin-top: 18px;
  color: #b91c1c;
  font-weight: 700;
}

.actions {
  margin-top: 24px;
}

.primary-btn {
  width: 100%;
  border: none;
  border-radius: 16px;
  padding: 16px 24px;
  background: #2563eb;
  color: white;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 12px 26px rgba(37, 99, 235, 0.28);
}

.primary-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
  box-shadow: none;
}
</style>