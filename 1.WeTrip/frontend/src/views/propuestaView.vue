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
const propuesta = ref(null);
const correo = ref("");
const votando = ref(false);
const confirmando = ref(false);

const usuarioGuardado = localStorage.getItem("user");
const usuarioActual = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;

const esCreador = computed(() => {
  if (!propuesta.value || !usuarioActual) return false;

  const creadorId =
    propuesta.value.creador?._id || propuesta.value.creador;

  return String(creadorId) === String(usuarioActual._id);
});

const votosPorPlan = computed(() => {
  const conteo = {};

  if (!propuesta.value?.votos) return conteo;

  propuesta.value.votos.forEach((voto) => {
    const id = voto.planId?._id || voto.planId;
    conteo[id] = (conteo[id] || 0) + 1;
  });

  return conteo;
});

const planMasVotadoId = computed(() => {
  let mayor = 0;
  let planId = null;

  Object.entries(votosPorPlan.value).forEach(([id, total]) => {
    if (total > mayor) {
      mayor = total;
      planId = id;
    }
  });

  return planId;
});

const cargarPropuesta = async () => {
  try {
    cargando.value = true;
    error.value = "";

    const { data } = await api.get(`/propuestas/${route.params.id}`);
    propuesta.value = data.propuesta;
  } catch (err) {
    console.error(err);
    error.value =
      err?.response?.data?.msg || "No se pudo cargar la propuesta.";
  } finally {
    cargando.value = false;
  }
};

const votar = async (planId) => {
  if (!correo.value.trim()) {
    alert("Introduce tu correo para votar.");
    return;
  }

  try {
    votando.value = true;

    await api.post(`/propuestas/${route.params.id}/votar`, {
      correo: correo.value.trim().toLowerCase(),
      planId
    });

    alert("Voto registrado correctamente.");
    await cargarPropuesta();
  } catch (err) {
    console.error(err);
    alert(err?.response?.data?.msg || "Error al votar.");
  } finally {
    votando.value = false;
  }
};

const confirmarPlan = async (planId) => {
  const confirmar = window.confirm(
    "¿Seguro que quieres confirmar este plan? Se creará la reserva final."
  );

  if (!confirmar) return;

  try {
    confirmando.value = true;

    await api.post(`/propuestas/${route.params.id}/confirmar`, {
      planId
    });

    alert("Plan confirmado y reserva creada correctamente.");
    router.push("/reservados");
  } catch (err) {
    console.error(err);
    alert(err?.response?.data?.msg || "No se pudo confirmar el plan.");
  } finally {
    confirmando.value = false;
  }
};

onMounted(() => {
  cargarPropuesta();
});
</script>

<template>
  <headerBar />

  <section class="propuesta-page">
    <div class="hero">
      <p class="eyebrow">WE TRIP</p>
      <h1>Elige el plan final</h1>
      <p class="hero-text">
        Revisa las opciones propuestas, vota por tu favorita y confirma un único plan para crear la reserva.
      </p>
    </div>

    <div v-if="cargando" class="state-box">
      Cargando propuesta...
    </div>

    <div v-else-if="error" class="state-box error">
      {{ error }}
    </div>

    <div v-else-if="propuesta" class="content">
      <div class="proposal-info">
        <div>
          <span>Estado</span>
          <strong>{{ propuesta.estado }}</strong>
        </div>

        <div>
          <span>Total de votos</span>
          <strong>{{ propuesta.votos?.length || 0 }}</strong>
        </div>
      </div>

      <div v-if="propuesta.estado === 'confirmada'" class="success-box">
        Esta propuesta ya ha sido confirmada.
      </div>

      <div v-if="propuesta.estado === 'pendiente'" class="correo-box">
        <label for="correo">Correo para votar</label>
        <input
          id="correo"
          v-model="correo"
          type="email"
          placeholder="Introduce tu correo"
        />
      </div>

      <div class="plans-grid">
        <div
          v-for="plan in propuesta.planes"
          :key="plan._id"
          class="plan-wrapper"
          :class="{ top: String(plan._id) === String(planMasVotadoId) }"
        >
          <div
            v-if="String(plan._id) === String(planMasVotadoId) && votosPorPlan[plan._id] > 0"
            class="top-badge"
          >
            Más votado
          </div>

          <planCard
            :plan="plan"
            :mostrarAcciones="false"
          />

          <div class="vote-info">
            <span>Votos</span>
            <strong>{{ votosPorPlan[plan._id] || 0 }}</strong>
          </div>

          <button
            v-if="propuesta.estado === 'pendiente'"
            class="vote-btn"
            @click="votar(plan._id)"
            :disabled="votando"
          >
            {{ votando ? "Guardando voto..." : "Votar este plan" }}
          </button>

          <button
            v-if="propuesta.estado === 'pendiente' && esCreador"
            class="confirm-btn"
            @click="confirmarPlan(plan._id)"
            :disabled="confirmando"
          >
            {{ confirmando ? "Confirmando..." : "Confirmar este plan" }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.propuesta-page {
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
  margin: 0 auto;
  max-width: 760px;
  color: #475569;
  font-size: 1.05rem;
  line-height: 1.6;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
}

.proposal-info {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 22px;
}

.proposal-info div,
.state-box,
.correo-box,
.success-box {
  background: white;
  border: 1px solid #dbeafe;
  border-radius: 18px;
  padding: 18px;
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.06);
}

.proposal-info span {
  display: block;
  color: #64748b;
  margin-bottom: 6px;
  font-size: 0.92rem;
}

.proposal-info strong {
  color: #0f172a;
  font-size: 1.2rem;
}

.state-box {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  color: #475569;
}

.state-box.error {
  color: #b91c1c;
  border-color: #fecaca;
  background: #fff5f5;
}

.success-box {
  margin-bottom: 22px;
  color: #15803d;
  font-weight: 800;
}

.correo-box {
  display: grid;
  gap: 8px;
  margin-bottom: 22px;
}

.correo-box label {
  color: #334155;
  font-weight: 800;
}

.correo-box input {
  min-height: 52px;
  padding: 13px 16px;
  border-radius: 14px;
  border: 1px solid #dbeafe;
  background: #f8fafc;
  outline: none;
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 22px;
}

.plan-wrapper {
  position: relative;
  display: grid;
  gap: 12px;
}

.plan-wrapper.top {
  padding: 8px;
  border-radius: 28px;
  background: #eff6ff;
}

.top-badge {
  position: absolute;
  top: 18px;
  left: 18px;
  z-index: 5;
  background: #2563eb;
  color: white;
  padding: 8px 12px;
  border-radius: 999px;
  font-weight: 800;
  font-size: 0.85rem;
}

.vote-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border: 1px solid #e2e8f0;
  padding: 14px 16px;
  border-radius: 16px;
}

.vote-info span {
  color: #64748b;
  font-weight: 700;
}

.vote-info strong {
  color: #0f172a;
}

.vote-btn,
.confirm-btn {
  border: none;
  border-radius: 16px;
  padding: 14px 18px;
  color: white;
  font-weight: 800;
  cursor: pointer;
}

.vote-btn {
  background: #2563eb;
}

.confirm-btn {
  background: #16a34a;
}

.vote-btn:disabled,
.confirm-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

@media (max-width: 700px) {
  .proposal-info {
    grid-template-columns: 1fr;
  }
}
</style>