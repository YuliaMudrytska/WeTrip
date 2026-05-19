<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../api/api";
import headerBar from "../components/headerBar.vue";

const route = useRoute();
const router = useRouter();

const cargando = ref(true);
const error = ref("");
const mensaje = ref("");

const verificarCorreo = async () => {
  try {
    cargando.value = true;

    const token = route.params.token;

    const { data } = await api.get(
      `/auth/verificar-email/${token}`
    );

    mensaje.value =
      data.msg || "Correo verificado correctamente.";

    setTimeout(() => {
      router.push("/login");
    }, 3000);

  } catch (err) {
    console.error(err);

    error.value =
      err?.response?.data?.msg ||
      "No se pudo verificar el correo.";
  } finally {
    cargando.value = false;
  }
};

onMounted(() => {
  verificarCorreo();
});
</script>

<template>
  <headerBar />

  <section class="verify-page">
    <div class="verify-card">

      <p class="eyebrow">WE TRIP</p>

      <h1>Verificación de correo</h1>

      <div v-if="cargando" class="loading">
        Verificando cuenta...
      </div>

      <div v-else-if="error" class="error-box">
        {{ error }}
      </div>

      <div v-else class="success-box">
        <p>{{ mensaje }}</p>

        <small>
          Serás redirigido al login en unos segundos...
        </small>
      </div>

    </div>
  </section>
</template>

<style scoped>
.verify-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  background:
    radial-gradient(circle at top left, rgba(59, 130, 246, 0.12), transparent 28%),
    linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%);
}

.verify-card {
  width: 100%;
  max-width: 520px;
  background: white;
  border-radius: 28px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08);
}

.eyebrow {
  color: #2563eb;
  font-weight: 800;
  letter-spacing: 0.08em;
  margin-bottom: 10px;
}

.verify-card h1 {
  margin-bottom: 26px;
  color: #0f172a;
}

.loading {
  color: #475569;
  font-weight: 600;
}

.success-box {
  background: #ecfdf5;
  border: 1px solid #6ee7b7;
  color: #065f46;
  padding: 20px;
  border-radius: 18px;
}

.success-box small {
  display: block;
  margin-top: 10px;
  color: #047857;
}

.error-box {
  background: #fff1f2;
  border: 1px solid #fecdd3;
  color: #be123c;
  padding: 20px;
  border-radius: 18px;
}
</style>