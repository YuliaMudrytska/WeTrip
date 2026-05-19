<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../api/api";

const router = useRouter();

const destino = ref("");
const cargando = ref(false);

const buscar = async () => {
  if (!destino.value.trim()) return;

  try {
    cargando.value = true;

    const { data } = await api.post("/search", {
      destino: destino.value
    });

    // SI hay historial
    if (data.existeHistorial) {
      const confirmar = confirm(
        "Ya habías buscado este destino. ¿Quieres modificar el formulario?"
      );

      if (!confirmar) {
        // ir directamente a planes con la búsqueda guardada
        router.push({
          path: "/planes",
          query: { id: data.ultimaBusqueda._id }
        });
        return;
      }

      // ir a formulario con datos previos
      router.push({
        path: "/formulario",
        query: { id: data.ultimaBusqueda._id }
      });

      return;
    }

    // NO hay historial → formulario nuevo
    router.push({
      path: "/formulario",
      query: { destino: destino.value }
    });

  } catch (err) {
    console.error(err);
    alert("Error buscando destino");
  } finally {
    cargando.value = false;
  }
};
</script>

<template>
  <div class="search-bar">
    <input
      v-model="destino"
      type="text"
      placeholder="¿Dónde quieres viajar?"
      @keyup.enter="buscar"
    />

    <button @click="buscar" :disabled="cargando">
      {{ cargando ? "Buscando..." : "Buscar" }}
    </button>
  </div>
</template>

<style scoped>
.search-bar {
  display: flex;
  gap: 10px;
}

input {
  flex: 1;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid #ccc;
}

button {
  padding: 14px 20px;
  border: none;
  border-radius: 12px;
  background: #2563eb;
  color: white;
  cursor: pointer;
}
</style>