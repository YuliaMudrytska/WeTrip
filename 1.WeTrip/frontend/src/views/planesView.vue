<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../api/api";
import headerBar from "../components/headerBar.vue";
import planCard from "../components/planCard.vue";

const route = useRoute();
const router = useRouter();

const cargando = ref(true);
const error = ref("");
const mensajeBackend = ref("");
const planes = ref([]);
const seleccionados = ref([]);
const favoritos = ref([]);
const busquedaActual = ref(null);
const guardandoReservas = ref(false);

const maxSeleccion = 10;
const minSeleccion = 2;

const cantidadSeleccionada = computed(() => seleccionados.value.length);
const maximoAlcanzado = computed(() => cantidadSeleccionada.value >= maxSeleccion);
const seleccionMinimaCumplida = computed(() => cantidadSeleccionada.value >= minSeleccion);

const mensajeMaximo = computed(() => {
  if (!maximoAlcanzado.value) return "";
  return "Has alcanzado el número máximo de opciones a elegir.";
});

const estaSeleccionado = (planId) => {
  return seleccionados.value.some((plan) => plan._id === planId);
};

const esFavorito = (planId) => {
  return favoritos.value.includes(planId);
};

const cargarFavoritos = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    const { data } = await api.get("/favoritos");
    favoritos.value = (data.favoritos || []).map((plan) => plan._id);
  } catch (err) {
    console.error("Error cargando favoritos:", err);
  }
};

const cargarBusqueda = async (busquedaId) => {
  try {
    const { data } = await api.get(`/formulario/${busquedaId}`);
    busquedaActual.value = data;
  } catch (err) {
    console.error("Error cargando búsqueda:", err);
  }
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
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Debes iniciar sesión para guardar favoritos.");
      return;
    }

    const yaEsFavorito = esFavorito(plan._id);

    if (yaEsFavorito) {
      await api.delete(`/favoritos/${plan._id}`);
      favoritos.value = favoritos.value.filter((id) => id !== plan._id);
      return;
    }

    await api.post("/favoritos", { planId: plan._id });
    favoritos.value.push(plan._id);
  } catch (err) {
    console.error(err);
    alert(err?.response?.data?.msg || "No se pudo actualizar favoritos.");
  }
};

const continuar = async () => {
  if (!seleccionMinimaCumplida.value) return;

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Debes iniciar sesión para reservar planes.");
    router.push("/login");
    return;
  }

  if (!busquedaActual.value) {
    alert("No se ha encontrado la búsqueda asociada.");
    return;
  }

  try {
    guardandoReservas.value = true;

    for (const plan of seleccionados.value) {
      const destinoFormateado = [plan.destinoId?.ciudad, plan.destinoId?.pais]
        .filter(Boolean)
        .join(", ");

      await api.post("/reservas", {
        planId: plan._id,
        destino: destinoFormateado,
        personas: busquedaActual.value.personas,
        fechaInicio: busquedaActual.value.fechaInicio,
        fechaFin: busquedaActual.value.fechaFin,
        precioFinal:
          Number(plan.precioBasePorPersona) * Number(busquedaActual.value.personas),
        presupuesto: busquedaActual.value.presupuesto,
        tipoPresupuesto: busquedaActual.value.tipoPresupuesto,
        planTipo: busquedaActual.value.planTipo
      });
    }

    alert("Reservas realizadas correctamente.");
    router.push("/reservados");
  } catch (err) {
    console.error(err);
    alert(err?.response?.data?.msg || "No se pudieron guardar las reservas.");
  } finally {
    guardandoReservas.value = false;
  }
};

onMounted(async () => {
  try {
    const busquedaId = route.query.id;

    if (!busquedaId) {
      error.value = "No se ha recibido una búsqueda válida.";
      cargando.value = false;
      return;
    }

    const { data } = await api.post("/planes", {
      busquedaId
    });

    planes.value = data.planes || [];
    mensajeBackend.value = data.mensaje || "";

    await cargarBusqueda(busquedaId);
    await cargarFavoritos();
  } catch (err) {
    console.error(err);
    error.value =
      err?.response?.data?.msg || "No se pudieron cargar los planes.";
  } finally {
    cargando.value = false;
  }
});
</script>

<template>
  <headerBar />
  <section class="planes-page">
    <div class="hero">
      <p class="eyebrow">WE TRIP</p>
      <h1>Elige las mejores opciones para tu viaje</h1>
      <p class="hero-text">
        Selecciona entre <strong>2</strong> y <strong>10</strong> opciones.
      </p>
    </div>

    <planCard
      v-for="plan in planes"
      :key="plan._id"
      :plan="plan"
      :seleccionado="estaSeleccionado(plan._id)"
      :favorito="esFavorito(plan._id)"
      @toggle-seleccion="toggleSeleccion"
      @toggle-favorito="toggleFavorito"
    />

    <div v-if="mensajeBackend || mensajeMaximo" class="top-alert">
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
        class="continue-btn"
        :disabled="!seleccionMinimaCumplida || guardandoReservas"
        @click="continuar"
      >
        {{ guardandoReservas ? "Guardando reservas..." : "Continuar" }}
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
      <article
        v-for="plan in planes"
        :key="plan._id"
        class="plan-card"
        :class="{ selected: estaSeleccionado(plan._id) }"
      >
        <button
          class="favorite-btn"
          @click="toggleFavorito(plan)"
          aria-label="Guardar en favoritos"
        >
          {{ esFavorito(plan._id) ? "♥" : "♡" }}
        </button>

        <div class="image-wrapper">
          <img
            :src="plan.imagen || 'https://via.placeholder.com/500x300?text=WE+TRIP'"
            :alt="`${plan.destinoId?.ciudad || 'Destino'}, ${plan.destinoId?.pais || ''}`"
          />
          <span v-if="estaSeleccionado(plan._id)" class="selected-badge">
            Seleccionado
          </span>
        </div>

        <div class="card-content">
          <h2 class="title">
            {{ plan.destinoId?.ciudad || "Destino" }}, {{ plan.destinoId?.pais || "País" }}
          </h2>

          <p class="description">
            {{ plan.descripcion || "Plan de viaje personalizado para tu búsqueda." }}
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

          <button
            class="select-btn"
            :class="{ disabled: !estaSeleccionado(plan._id) && maximoAlcanzado }"
            @click="toggleSeleccion(plan)"
          >
            {{ estaSeleccionado(plan._id) ? "Quitar opción" : "Añadir opción" }}
          </button>
        </div>
      </article>
    </div>

    <div v-if="mensajeMaximo" class="bottom-alert">
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

.continue-btn {
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

.continue-btn:disabled {
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

.plan-card {
  position: relative;
  background: #ffffff;
  border: 1px solid #e8e8e8;
  border-radius: 22px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.plan-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 35px rgba(0, 0, 0, 0.09);
}

.plan-card.selected {
  border-color: #3b82f6;
  box-shadow: 0 18px 35px rgba(59, 130, 246, 0.16);
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

.selected-badge {
  position: absolute;
  left: 14px;
  bottom: 14px;
  background: #2563eb;
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
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

.select-btn {
  width: 100%;
  border: none;
  border-radius: 14px;
  padding: 14px 16px;
  background: #111827;
  color: white;
  font-size: 0.98rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.select-btn:hover {
  transform: translateY(-1px);
}

.select-btn.disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

@media (max-width: 860px) {
  .summary-bar {
    grid-template-columns: 1fr;
  }

  .continue-btn {
    width: 100%;
  }
}
</style>