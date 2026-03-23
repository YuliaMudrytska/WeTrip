<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../api/api";

const route = useRoute();
const router = useRouter();

const cargando = ref(false);
const error = ref("");
const avisoPresupuesto = ref("");

const form = ref({
  destino: "",
  personas: 1,
  presupuesto: "",
  tipoPresupuesto: "total",
  fechaInicio: "",
  fechaFin: "",
  planTipo: "completo",
  correos: [""]
});

const opcionesPlan = [
  { value: "completo", label: "Set completo" },
  { value: "transporte_alojamiento", label: "Transporte + alojamiento" },
  { value: "transporte_rutas", label: "Transporte + rutas" },
  { value: "alojamiento_rutas", label: "Alojamiento + rutas" }
];

const actualizarCorreos = () => {
  const total = Number(form.value.personas) || 1;
  const cantidad = Math.max(1, total);

  while (form.value.correos.length < cantidad) {
    form.value.correos.push("");
  }

  while (form.value.correos.length > cantidad) {
    form.value.correos.pop();
  }
};

watch(
  () => form.value.personas,
  () => {
    actualizarCorreos();
  }
);

watch(
  () => form.value.presupuesto,
  (nuevoValor) => {
    avisoPresupuesto.value = nuevoValor
      ? ""
      : "Si no indicas presupuesto, se mostrarán planes con un coste máximo de 500€ por persona.";
  },
  { immediate: true }
);

onMounted(() => {
  if (route.query.destino) {
    form.value.destino = route.query.destino;
  }

  if (route.query.data) {
    const datos = JSON.parse(route.query.data);

    Object.assign(form.value, {
      ...form.value,
      ...datos
    });

    if (!Array.isArray(form.value.correos) || !form.value.correos.length) {
      form.value.correos = [""];
    }
  }

  actualizarCorreos();
});

const enviar = async () => {
  error.value = "";

  if (
    !form.value.destino ||
    !form.value.personas ||
    !form.value.fechaInicio ||
    !form.value.fechaFin ||
    !form.value.planTipo
  ) {
    error.value = "Completa todos los campos obligatorios.";
    return;
  }

  if (Number(form.value.personas) >= 2) {
    const correo1 = form.value.correos[0]?.trim();
    const correo2 = form.value.correos[1]?.trim();

    if (!correo1 || !correo2) {
      error.value = "Debes rellenar al menos dos correos si viajan dos o más personas.";
      return;
    }
  }

  try {
    cargando.value = true;

    const payload = {
      ...form.value,
      personas: Number(form.value.personas),
      presupuesto: form.value.presupuesto ? Number(form.value.presupuesto) : undefined,
      correos: form.value.correos.filter((correo) => correo.trim() !== "")
    };

    const res = await api.post("/formulario", payload);

    router.push({
      path: "/planes",
      query: { id: res.data.busquedaId }
    });
  } catch (err) {
    console.error(err);
    error.value = "No se pudo guardar el formulario.";
  } finally {
    cargando.value = false;
  }
};
</script>

<template>
  <section class="form-page">
    <div class="form-header">
      <p class="eyebrow">WE TRIP</p>
      <h1>Completa los datos de tu viaje</h1>
      <p class="header-text">
        Ajusta tu búsqueda con fechas, personas, tipo de plan y presupuesto para obtener
        opciones más adecuadas.
      </p>
    </div>

    <div v-if="avisoPresupuesto" class="info-alert">
      {{ avisoPresupuesto }}
    </div>

    <div class="form-card">
      <div class="form-grid">
        <div class="field full">
          <label for="destino">Destino</label>
          <input id="destino" v-model="form.destino" type="text" placeholder="Ej: Tokio" />
        </div>

        <div class="field">
          <label for="personas">Nº de personas</label>
          <input id="personas" v-model="form.personas" type="number" min="1" />
        </div>

        <div class="field">
          <label for="planTipo">Plan</label>
          <select id="planTipo" v-model="form.planTipo">
            <option v-for="opcion in opcionesPlan" :key="opcion.value" :value="opcion.value">
              {{ opcion.label }}
            </option>
          </select>
        </div>

        <div class="field">
          <label for="fechaInicio">Fecha ida</label>
          <input id="fechaInicio" v-model="form.fechaInicio" type="date" />
        </div>

        <div class="field">
          <label for="fechaFin">Fecha vuelta</label>
          <input id="fechaFin" v-model="form.fechaFin" type="date" />
        </div>

        <div class="field">
          <label for="presupuesto">Presupuesto</label>
          <input
            id="presupuesto"
            v-model="form.presupuesto"
            type="number"
            min="0"
            placeholder="Opcional"
          />
        </div>

        <div class="field">
          <label for="tipoPresupuesto">Tipo de presupuesto</label>
          <select id="tipoPresupuesto" v-model="form.tipoPresupuesto">
            <option value="total">Total</option>
            <option value="individual">Individual</option>
          </select>
        </div>
      </div>

      <div class="emails-section">
        <div class="section-title-row">
          <h2>Correos de viajeros</h2>
          <span class="section-note">
            Con 2 o más personas, los 2 primeros correos son obligatorios.
          </span>
        </div>

        <div class="emails-grid">
          <div class="field" v-for="(correo, index) in form.correos" :key="index">
            <label :for="`correo-${index}`">
              Correo {{ index + 1 }}
              <span v-if="Number(form.personas) >= 2 && index < 2" class="required-mark">*</span>
            </label>
            <input
              :id="`correo-${index}`"
              v-model="form.correos[index]"
              type="email"
              placeholder="correo@ejemplo.com"
            />
          </div>
        </div>
      </div>

      <p v-if="error" class="error-message">{{ error }}</p>

      <div class="actions">
        <button class="primary-btn" @click="enviar" :disabled="cargando">
          {{ cargando ? "Guardando..." : "Buscar planes" }}
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.form-page {
  min-height: 100vh;
  padding: 40px 24px 60px;
  background:
    radial-gradient(circle at top left, rgba(59, 130, 246, 0.12), transparent 28%),
    linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%);
}

.form-header {
  max-width: 950px;
  margin: 0 auto 24px;
  text-align: center;
}

.eyebrow {
  margin: 0 0 8px;
  color: #2563eb;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.form-header h1 {
  margin: 0 0 12px;
  font-size: clamp(2rem, 5vw, 3.1rem);
  color: #0f172a;
  line-height: 1.1;
}

.header-text {
  max-width: 760px;
  margin: 0 auto;
  color: #475569;
  font-size: 1.05rem;
  line-height: 1.6;
}

.info-alert {
  max-width: 1100px;
  margin: 0 auto 22px;
  background: #eff6ff;
  border: 1px solid #93c5fd;
  color: #1d4ed8;
  border-radius: 18px;
  padding: 16px 18px;
  font-weight: 600;
}

.form-card {
  max-width: 1100px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid #dbeafe;
  border-radius: 28px;
  padding: 28px;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.field {
  display: flex;
  flex-direction: column;
}

.field.full {
  grid-column: 1 / -1;
}

.field label {
  margin-bottom: 8px;
  color: #334155;
  font-weight: 700;
}

.field input,
.field select {
  min-height: 54px;
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px solid #dbeafe;
  background: #f8fafc;
  color: #0f172a;
  font-size: 0.98rem;
  outline: none;
}

.field input:focus,
.field select:focus {
  border-color: #60a5fa;
  background: white;
  box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.14);
}

.emails-section {
  margin-top: 30px;
  padding-top: 26px;
  border-top: 1px solid #e2e8f0;
}

.section-title-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
  margin-bottom: 18px;
}

.section-title-row h2 {
  margin: 0;
  color: #0f172a;
  font-size: 1.3rem;
}

.section-note {
  color: #64748b;
  font-size: 0.95rem;
}

.emails-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.required-mark {
  color: #dc2626;
  margin-left: 4px;
}

.error-message {
  margin: 22px 0 0;
  color: #b91c1c;
  font-weight: 700;
}

.actions {
  margin-top: 26px;
  display: flex;
  justify-content: flex-end;
}

.primary-btn {
  border: none;
  border-radius: 16px;
  padding: 16px 24px;
  background: #2563eb;
  color: white;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  min-width: 200px;
  box-shadow: 0 12px 26px rgba(37, 99, 235, 0.28);
}

.primary-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
  box-shadow: none;
}

@media (max-width: 860px) {
  .form-grid,
  .emails-grid {
    grid-template-columns: 1fr;
  }

  .section-title-row {
    flex-direction: column;
  }

  .actions {
    justify-content: stretch;
  }

  .primary-btn {
    width: 100%;
  }
}
</style>