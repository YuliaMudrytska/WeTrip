<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import api from "../api/api";
import PlanCard from "../components/planes.vue";

const route = useRoute();

const planes = ref([]);
const mensajeBackend = ref("");
const cargando = ref(true);
const error = ref("");
const seleccionados = ref([]);
const favoritos = ref([]);

const maxSeleccion = 10;
const minSeleccion = 2;

const maximoAlcanzado = computed(() => seleccionados.value.length >= maxSeleccion);
const seleccionMinimaCumplida = computed(() => seleccionados.value.length >= minSeleccion);

const mensajeMaximo = computed(() => {
  if (!maximoAlcanzado.value) return "";
  return "Has alcanzado el número máximo de opciones a elegir.";
});

const cantidadSeleccionada = computed(() => seleccionados.value.length);

const estaSeleccionado = (planId) => {
  return seleccionados.value.some((plan) => plan._id === planId);
};

const esFavorito = (planId) => {
  return favoritos.value.includes(planId);
};

const toggleSeleccion = (plan) => {
  const yaExiste = estaSeleccionado(plan._id);

  if (yaExiste) {
    seleccionados.value = seleccionados.value.filter((p) => p._id !== plan._id);
    return;
  }

  if (seleccionados.value.length >= maxSeleccion) return;

  seleccionados.value.push(plan);
};

const toggleFavorito = async (plan) => {
  try {
    const yaEsFavorito = esFavorito(plan._id);

    if (yaEsFavorito) {
      favoritos.value = favoritos.value.filter((id) => id !== plan._id);
      return;
    }

    favoritos.value.push(plan._id);

    // Cuando conectes favoritos reales:
    // await api.post("/favoritos", { planId: plan._id });
  } catch (err) {
    console.error(err);
  }
};

const reservarSeleccionados = async () => {
  if (!seleccionMinimaCumplida.value) return;

  try {
    console.log("Planes seleccionados:", seleccionados.value);

    // Aquí conectarás con reservas después.
    // Ejemplo:
    // await api.post("/reservas", { planes: seleccionados.value });

    alert("Selección guardada correctamente.");
  } catch (err) {
    console.error(err);
    error.value = "No se pudo guardar la selección.";
  }
};

onMounted(async () => {
  try {
    const busquedaId = route.query.id;

    if (!busquedaId) {
      error.value = "No se ha recibido la búsqueda.";
      cargando.value = false;
      return;
    }

    const res = await api.post("/planes", { busquedaId });

    planes.value = res.data.planes || [];
    mensajeBackend.value = res.data.mensaje || "";
  } catch (err) {
    console.error(err);
    error.value = "Hubo un problema al cargar los planes.";
  } finally {
    cargando.value = false;
  }
});
</script>

<template>
  <section class="planes-page">
    <div class="hero">
      <p class="eyebrow">WE TRIP</p>
      <h1>Elige tus mejores opciones de viaje</h1>
      <p class="hero-text">
        Selecciona entre <strong>2</strong> y <strong>10</strong> planes para compararlos,
        guardarlos o continuar con tu reserva.
      </p>
    </div>

    <div class="top-alert" v-if="mensajeBackend || mensajeMaximo">
      <p v-if="mensajeBackend">{{ mensajeBackend }}</p>
      <p v-if="mensajeMaximo">{{ mensajeMaximo }}</p>
    </div>

    <div class="summary-bar">
      <div class="summary-box">
        <span class="summary-label">Seleccionados</span>
        <strong>{{ cantidadSeleccionada }}/10</strong>
      </div>

      <div class="summary-box">
        <span class="summary-label">Mínimo requerido</span>
        <strong>2 planes</strong>
      </div>

      <button
        class="reserve-btn"
        :disabled="!seleccionMinimaCumplida"
        @click="reservarSeleccionados"
      >
        Continuar
      </button>
    </div>

    <div v-if="cargando" class="state-box">
      Cargando planes...
    </div>

    <div v-else-if="error" class="state-box error">
      {{ error }}
    </div>

    <div v-else-if="planes.length === 0" class="state-box">
      No se han encontrado planes para esta búsqueda.
    </div>

    <div v-else class="plans-grid">
      <PlanCard
        v-for="plan in planes"
        :key="plan._id"
        :plan="plan"
        :seleccionado="estaSeleccionado(plan._id)"
        :maximoAlcanzado="maximoAlcanzado"
        @toggle-seleccion="toggleSeleccion"
        @toggle-favorito="toggleFavorito"
      />
    </div>

    <div class="bottom-alert" v-if="mensajeMaximo">
      {{ mensajeMaximo }}
    </div>
  </section>
</template>

<style scoped>
.planes-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(59, 130, 246, 0.12), transparent 28%),
    linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%);
  padding: 40px 24px 60px;
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

.top-alert,
.bottom-alert {
  max-width: 1200px;
  margin: 0 auto 22px;
  background: #fff7ed;
  border: 1px solid #fdba74;
  color: #9a3412;
  border-radius: 18px;
  padding: 16px 18px;
  font-weight: 600;
}

.bottom-alert {
  margin-top: 24px;
}

.top-alert p {
  margin: 0;
}

.top-alert p + p {
  margin-top: 8px;
}

.summary-bar {
  max-width: 1200px;
  margin: 0 auto 28px;
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 16px;
  align-items: center;
}

.summary-box {
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid #dbeafe;
  border-radius: 18px;
  padding: 18px;
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.06);
}

.summary-label {
  display: block;
  color: #64748b;
  margin-bottom: 6px;
  font-size: 0.92rem;
}

.summary-box strong {
  color: #0f172a;
  font-size: 1.2rem;
}

.reserve-btn {
  border: none;
  border-radius: 16px;
  padding: 18px 24px;
  background: #2563eb;
  color: white;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  min-width: 180px;
  box-shadow: 0 12px 26px rgba(37, 99, 235, 0.28);
}

.reserve-btn:disabled {
  background: #94a3b8;
  box-shadow: none;
  cursor: not-allowed;
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

@media (max-width: 860px) {
  .summary-bar {
    grid-template-columns: 1fr;
  }

  .reserve-btn {
    width: 100%;
  }
}
</style>