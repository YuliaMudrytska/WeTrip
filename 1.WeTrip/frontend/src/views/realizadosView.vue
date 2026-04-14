<script setup>
import { ref, onMounted } from "vue";
import api from "../api/api";
import headerBar from "../components/headerBar.vue";

const cargando = ref(true);
const moviendo = ref(false);
const error = ref("");
const realizados = ref([]);

const moverReservasVencidas = async () => {
  try {
    moviendo.value = true;
    await api.post("/reservas/mover-a-realizados");
  } catch (err) {
    console.error("Error moviendo reservas vencidas:", err);
  } finally {
    moviendo.value = false;
  }
};

const cargarRealizados = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    error.value = "Debes iniciar sesión para ver tus planes realizados.";
    cargando.value = false;
    return;
  }

  try {
    cargando.value = true;
    error.value = "";

    await moverReservasVencidas();

    const { data } = await api.get("/reservas/realizados");
    realizados.value = data.planesRealizados || [];
  } catch (err) {
    console.error(err);
    error.value =
      err?.response?.data?.msg || "No se pudieron cargar los planes realizados.";
  } finally {
    cargando.value = false;
  }
};

onMounted(() => {
  cargarRealizados();
});
</script>

<template>
  <headerBar />

  <section class="realizados-page">
    <div class="hero">
      <p class="eyebrow">WE TRIP</p>
      <h1>Planes realizados</h1>
      <p class="hero-text">
        Aquí puedes ver el historial de viajes que ya has completado.
      </p>
    </div>

    <div v-if="moviendo && !cargando" class="info-box">
      Actualizando viajes finalizados...
    </div>

    <div v-if="cargando" class="state-box">
      Cargando planes realizados...
    </div>

    <div v-else-if="error" class="state-box error">
      {{ error }}
    </div>

    <div v-else-if="realizados.length === 0" class="state-box">
      Todavía no tienes planes realizados.
    </div>

    <div v-else class="plans-grid">
      <article
        v-for="(plan, index) in realizados"
        :key="`${plan.planId?._id || plan.planId}-${index}`"
        class="plan-card"
      >
        <div class="image-wrapper">
          <img
            :src="plan.planId?.imagen || 'https://via.placeholder.com/500x300?text=WE+TRIP'"
            :alt="plan.destino || 'Plan realizado'"
          />
          <span class="done-badge">Realizado</span>
        </div>

        <div class="card-content">
          <h2 class="title">
            {{ plan.destino || "Destino realizado" }}
          </h2>

          <p class="description">
            {{ plan.planId?.descripcion || "Viaje ya completado por el usuario." }}
          </p>

          <div class="features">
            <span :class="{ active: plan.planId?.incluye?.transporte }">Transporte</span>
            <span :class="{ active: plan.planId?.incluye?.alojamiento }">Alojamiento</span>
            <span :class="{ active: plan.planId?.incluye?.rutas }">Rutas</span>
          </div>

          <div class="info-block">
            <p><strong>Personas:</strong> {{ plan.personas }}</p>
            <p><strong>Ida:</strong> {{ String(plan.fechaInicio).slice(0, 10) }}</p>
            <p><strong>Vuelta:</strong> {{ String(plan.fechaFin).slice(0, 10) }}</p>
            <p v-if="plan.precioFinal !== null && plan.precioFinal !== undefined">
              <strong>Precio final:</strong> {{ plan.precioFinal }} €
            </p>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.realizados-page {
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

.info-box {
  max-width: 1200px;
  margin: 0 auto 20px;
  background: #eff6ff;
  border: 1px solid #93c5fd;
  color: #1d4ed8;
  border-radius: 18px;
  padding: 16px 18px;
  font-weight: 600;
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
  background: #ffffff;
  border: 1px solid #e8e8e8;
  border-radius: 22px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
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

.done-badge {
  position: absolute;
  left: 14px;
  bottom: 14px;
  background: #16a34a;
  color: white;
  font-size: 0.85rem;
  font-weight: 700;
  padding: 8px 12px;
  border-radius: 999px;
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

.info-block {
  display: grid;
  gap: 8px;
  color: #334155;
}
</style>