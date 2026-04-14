<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const usuario = ref(null);

onMounted(() => {
  try {
    const user = localStorage.getItem("user");

    if (!user) {
      router.push("/login");
      return;
    }

    usuario.value = JSON.parse(user);
  } catch (error) {
    router.push("/login");
  }
});

const cerrarSesion = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  router.push("/");
  window.location.reload();
};
</script>

<template>
  <section class="page">
    <div class="card">
      <p class="eyebrow">WE TRIP</p>
      <h1>Mi cuenta</h1>

      <div v-if="usuario" class="user-info">
        <p><strong>Nombre:</strong> {{ usuario.nombre }}</p>
        <p><strong>Email:</strong> {{ usuario.email }}</p>
      </div>

      <div class="actions">
        <button class="logout-btn" @click="cerrarSesion">
          Cerrar sesión
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background:
    radial-gradient(circle at top left, rgba(59, 130, 246, 0.12), transparent 28%),
    linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%);
}

.card {
  width: 100%;
  max-width: 700px;
  padding: 40px;
  background: white;
  border-radius: 24px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
  text-align: center;
}

.eyebrow {
  margin-bottom: 10px;
  color: #2563eb;
  font-weight: 800;
  letter-spacing: 0.08em;
}

h1 {
  margin-bottom: 20px;
  color: #0f172a;
}

.user-info {
  margin-bottom: 24px;
  color: #334155;
  line-height: 1.6;
}

.actions {
  margin-top: 20px;
}

.logout-btn {
  border: none;
  border-radius: 16px;
  padding: 14px 22px;
  background: #dc2626;
  color: white;
  font-weight: 700;
  cursor: pointer;
}
</style>