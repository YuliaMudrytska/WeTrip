<script setup>
import { ref, onMounted } from "vue";
import api from "../api/api";
import headerBar from "../components/headerBar.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const propuestas = ref([]);
const cargando = ref(true);
const error = ref("");

const cargarPropuestas = async () => {
  try {
    cargando.value = true;
    error.value = "";

    console.log("CARGANDO PROPUESTAS...");

    const { data } = await api.get("/propuestas/mis-propuestas");

    console.log("PROPUESTAS RECIBIDAS:", data);

    propuestas.value = data.propuestas || [];
  } catch (err) {
    console.error("ERROR PROPUESTAS:", err);
    error.value = err?.response?.data?.msg || "Error cargando propuestas";
  } finally {
    cargando.value = false;
  }
};

const irAPropuesta = (id) => {
  router.push(`/propuesta/${id}`);
};

const getDestino = (propuesta) => {
  const primerPlan = propuesta.planes?.[0];
  const ciudad = primerPlan?.destinoId?.ciudad;
  const pais = primerPlan?.destinoId?.pais;

  return [ciudad, pais].filter(Boolean).join(", ") || "Destino";
};

const getImagen = (propuesta) => {
  return propuesta.planes?.[0]?.imagen || "https://via.placeholder.com/500x300?text=WE+TRIP";
};

const getPlanConfirmado = (propuesta) => {
  return propuesta.planConfirmado?.descripcion || "Pendiente de elegir";
};

onMounted(() => {
  cargarPropuestas();
});
</script>

<template>
  <headerBar />

  <section class="propuestas-page">
    <div class="hero">
      <p class="eyebrow">WE TRIP</p>
      <h1>Mis propuestas</h1>
      <p class="hero-text">
        Aquí puedes revisar las propuestas creadas, ver sus votos y confirmar el plan final.
      </p>
    </div>

    <div v-if="cargando" class="state-box">
      Cargando propuestas...
    </div>

    <div v-else-if="error" class="state-box error">
      {{ error }}
    </div>

    <div v-else-if="propuestas.length === 0" class="state-box">
      Todavía no tienes propuestas creadas.
    </div>

    <div v-else class="propuestas-grid">
      <article
        v-for="propuesta in propuestas"
        :key="propuesta._id"
        class="proposal-card"
      >
        <div class="image-wrapper">
          <img
            :src="getImagen(propuesta)"
            :alt="getDestino(propuesta)"
          />

          <span
            class="status-badge"
            :class="propuesta.estado"
          >
            {{ propuesta.estado }}
          </span>
        </div>

        <div class="card-content">
          <h2>{{ getDestino(propuesta) }}</h2>

          <p class="description">
            {{ propuesta.estado === "confirmada"
              ? "Esta propuesta ya tiene un plan final confirmado."
              : "Propuesta pendiente de votos y confirmación final."
            }}
          </p>

          <div class="stats-grid">
            <div>
              <span>Opciones</span>
              <strong>{{ propuesta.planes?.length || 0 }}</strong>
            </div>

            <div>
              <span>Votos</span>
              <strong>{{ propuesta.votos?.length || 0 }}</strong>
            </div>
          </div>

          <div class="confirmed-box">
            <span>Plan final</span>
            <strong>{{ getPlanConfirmado(propuesta) }}</strong>
          </div>

          <button class="open-btn" @click="irAPropuesta(propuesta._id)">
            Ver propuesta
          </button>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.propuestas-page {
  min-height: 100vh;
  padding: 40px 24px 60px;
  background:
    radial-gradient(circle at top left, rgba(59, 130, 246, 0.12), transparent 28%),
    linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%);
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
  max-width: 760px;
  margin: 0 auto;
  color: #475569;
  font-size: 1.05rem;
  line-height: 1.6;
}

.state-box {
  max-width: 1100px;
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

.propuestas-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 22px;
}

.proposal-card {
  overflow: hidden;
  background: white;
  border-radius: 24px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.07);
}

.image-wrapper {
  position: relative;
  height: 210px;
  overflow: hidden;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.status-badge {
  position: absolute;
  top: 14px;
  left: 14px;
  padding: 8px 12px;
  border-radius: 999px;
  color: white;
  font-size: 0.85rem;
  font-weight: 800;
}

.status-badge.pendiente {
  background: #f97316;
}

.status-badge.confirmada {
  background: #16a34a;
}

.status-badge.cancelada {
  background: #dc2626;
}

.card-content {
  padding: 22px;
}

.card-content h2 {
  margin: 0 0 10px;
  color: #0f172a;
  font-size: 1.35rem;
}

.description {
  margin: 0 0 18px;
  color: #64748b;
  line-height: 1.5;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.stats-grid div,
.confirmed-box {
  padding: 14px;
  border-radius: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.stats-grid span,
.confirmed-box span {
  display: block;
  margin-bottom: 4px;
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 700;
}

.stats-grid strong,
.confirmed-box strong {
  color: #0f172a;
}

.confirmed-box {
  margin-bottom: 18px;
}

.open-btn {
  width: 100%;
  border: none;
  border-radius: 16px;
  padding: 14px 18px;
  background: #2563eb;
  color: white;
  font-weight: 800;
  cursor: pointer;
}

.open-btn:hover {
  background: #1d4ed8;
}

@media (max-width: 640px) {
  .propuestas-page {
    padding: 28px 16px 50px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>