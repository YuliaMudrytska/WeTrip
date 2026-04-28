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
    const { data } = await api.get("/propuestas/mis-propuestas");
    propuestas.value = data.propuestas;
  } catch (err) {
    console.error(err);
    error.value = "Error cargando propuestas";
  } finally {
    cargando.value = false;
  }
};

const irAPropuesta = (id) => {
  router.push(`/propuesta/${id}`);
};

onMounted(() => {
  cargarPropuestas();
});
</script>

<template>
  <headerBar />

  <section class="page">
    <h1>Mis propuestas</h1>

    <div v-if="cargando">Cargando...</div>
    <div v-else-if="error">{{ error }}</div>

    <div v-else-if="propuestas.length === 0">
      No tienes propuestas aún.
    </div>

    <div v-else class="grid">
      <div
        v-for="p in propuestas"
        :key="p._id"
        class="card"
        @click="irAPropuesta(p._id)"
      >
        <h3>
          {{ p.planes[0]?.destinoId?.ciudad || "Destino" }}
        </h3>

        <p>Planes: {{ p.planes.length }}</p>

        <p>
          Estado:
          <strong :class="p.estado">
            {{ p.estado }}
          </strong>
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.page {
  padding: 40px;
}

.grid {
  display: grid;
  gap: 20px;
}

.card {
  background: white;
  padding: 20px;
  border-radius: 16px;
  cursor: pointer;
  transition: 0.2s;
}

.card:hover {
  transform: translateY(-3px);
}

.pendiente {
  color: orange;
}

.confirmada {
  color: green;
}
</style>