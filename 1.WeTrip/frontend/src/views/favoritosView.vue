<script setup>
import { ref, onMounted } from "vue";
import api from "../api/api";
import headerBar from "../components/headerBar.vue";

const cargando = ref(true);
const error = ref("");
const favoritos = ref([]);

const cargarFavoritos = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    error.value = "Debes iniciar sesión para ver tus favoritos.";
    cargando.value = false;
    return;
  }

  try {
    cargando.value = true;
    error.value = "";

    const { data } = await api.get("/favoritos");
    favoritos.value = data.favoritos || [];
  } catch (err) {
    console.error(err);
    error.value =
      err?.response?.data?.msg || "No se pudieron cargar los favoritos.";
  } finally {
    cargando.value = false;
  }
};

const quitarFavorito = async (planId) => {
  try {
    await api.delete(`/favoritos/${planId}`);
    favoritos.value = favoritos.value.filter((plan) => plan._id !== planId);
  } catch (err) {
    console.error(err);
    alert(err?.response?.data?.msg || "No se pudo eliminar de favoritos.");
  }
};

onMounted(() => {
  cargarFavoritos();
});
</script>

<template>
  <headerBar />

  <section class="favoritos-page">
    <div class="hero">
      <p class="eyebrow">WE TRIP</p>
      <h1>Tus favoritos</h1>
      <p class="hero-text">
        Planes ha realizar.
      </p>
    </div>

    <div v-if="cargando" class="state-box">
      Cargando favoritos...
    </div>

    <div v-else-if="error" class="state-box error">
      {{ error }}
    </div>

    <div v-else-if="favoritos.length === 0" class="state-box">
      Todavía no has guardado ningún plan en favoritos.
    </div>

    <div v-else class="plans-grid">
      <article
        v-for="plan in favoritos"
        :key="plan._id"
        class="plan-card"
      >
        <button
          class="favorite-btn active"
          @click="quitarFavorito(plan._id)"
          aria-label="Quitar de favoritos"
        >
          ♥
        </button>

        <div class="image-wrapper">
          <img
            :src="plan.imagen || 'https://via.placeholder.com/500x300?text=WE+TRIP'"
            :alt="`${plan.destinoId?.ciudad || 'Destino'}, ${plan.destinoId?.pais || ''}`"
          />
        </div>

        <div class="card-content">
          <h2 class="title">
            {{ plan.destinoId?.ciudad || "Destino" }}, {{ plan.destinoId?.pais || "País" }}
          </h2>

          <p class="description">
            {{ plan.descripcion || "Plan de viaje guardado en favoritos." }}
          </p>

          <div class="features">
            <span :class="{ active: plan.incluye?.transporte }">Transporte</span>
            <span :class="{ active: plan.incluye?.alojamiento }">Alojamiento</span>
            <span :class="{ active: plan.incluye?.rutas }">Rutas</span>
          </div>

          <div class="info-row">
            <p class="price">
              {{ plan.precioBasePorPersona }} €
              <small>/ persona</small>
            </p>

            <p class="capacity">
              Máx. {{ plan.maxPersonas }} personas
            </p>
          </div>

          <button class="remove-btn" @click="quitarFavorito(plan._id)">
            Quitar de favoritos
          </button>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.favoritos-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(59, 130, 246, 0.12), transparent 28%),
    linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%);
  padding: 24px 24px 60px;
}

.hero {
  max-width: 900px;
  margin: 0 auto 28px;
  text-align: center;
}

.eyebrow {
  margin: 0 0 8px;
  color: #2563eb;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.hero h1 {
  margin: 0 0 12px;
  font-size: clamp(2rem, 5vw, 3.2rem);
  color: #0f172a;
  line-height: 1.1;
}

.hero-text {
  margin: 0 auto;
  max-width: 760px;
  color: #475569;
  font-size: 1.05rem;
  line-height: 1.6;
}

.state-box {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  color: #475569;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
}

.state-box.error {
  color: #b91c1c;
  border: 1px solid #fecaca;
  background: #fff5f5;
}

.plans-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 22px;
}

.plan-card {
  position: relative;
  background: #ffffff;
  border: 1px solid #e8e8e8;
  border-radius: 22px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
}

.favorite-btn {
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 2;
  width: 42px;
  height: 42px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  cursor: pointer;
  font-size: 1.1rem;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.12);
}

.favorite-btn.active {
  color: #dc2626;
}

.image-wrapper {
  position: relative;
  height: 220px;
  overflow: hidden;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.card-content {
  padding: 20px;
}

.title {
  margin: 0 0 10px;
  font-size: 1.25rem;
  color: #111827;
}

.description {
  margin: 0 0 16px;
  color: #4b5563;
  line-height: 1.5;
  min-height: 48px;
}

.features {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 18px;
}

.features span {
  padding: 8px 12px;
  border-radius: 999px;
  background: #f3f4f6;
  color: #6b7280;
  font-size: 0.9rem;
  font-weight: 600;
}

.features span.active {
  background: #dbeafe;
  color: #1d4ed8;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}

.price {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 700;
  color: #111827;
}

.price small {
  font-size: 0.85rem;
  font-weight: 500;
  color: #6b7280;
}

.capacity {
  margin: 0;
  color: #6b7280;
  font-size: 0.95rem;
}

.remove-btn {
  width: 100%;
  border: none;
  border-radius: 14px;
  padding: 14px 16px;
  background: #111827;
  color: white;
  font-size: 0.98rem;
  font-weight: 700;
  cursor: pointer;
}
</style>