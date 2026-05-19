<script setup>
const props = defineProps({
  plan: Object,
  seleccionado: Boolean,
  favorito: Boolean,
  mostrarAcciones: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits([
  "toggle-seleccion",
  "toggle-favorito"
]);

const handleSeleccion = () => {
  emit("toggle-seleccion", props.plan);
};

const handleFavorito = () => {
  emit("toggle-favorito", props.plan);
};
</script>

<template>
  <article class="card" :class="{ selected: seleccionado }">

    <!-- FAVORITO -->
    <button
      v-if="mostrarAcciones"
      class="fav-btn"
      @click="handleFavorito"
    >
      {{ favorito ? "♥" : "♡" }}
    </button>
     
    <!-- IMAGEN -->
    <div class="image">
      <img
        :src="plan.imagen || 'https://via.placeholder.com/400x250?text=WE+TRIP'"
        alt="Plan"
      />
    </div>

    <!-- CONTENIDO -->
    <div class="content">
      <h3 class="title">
        {{ plan.destinoId?.ciudad || "Destino" }}
      </h3>

      <p class="desc">
        {{ plan.descripcion || "Descripción del plan de viaje." }}
      </p>

      <div class="features">
        <span :class="{ active: plan.incluye?.transporte }">🚗</span>
        <span :class="{ active: plan.incluye?.alojamiento }">🏨</span>
        <span :class="{ active: plan.incluye?.rutas }">🗺️</span>
      </div>

      <p class="price">
        {{ plan.precioBasePorPersona }} €
        <small>/ persona</small>
      </p>
    </div>

    <!-- BOTÓN + -->
    <button
      v-if="mostrarAcciones"
      class="add-btn"
      @click="handleSeleccion"
    >
      {{ seleccionado ? "✓" : "+" }}
    </button>
  </article>
</template>

<style scoped>
.card {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  background: #f9fafb;
  box-shadow: 0 10px 25px rgba(0,0,0,0.06);
  transition: 0.25s;
}

.card:hover {
  transform: translateY(-4px);
}

.card.selected {
  outline: 3px solid #3b82f6;
}

/* FAVORITO */
.fav-btn {
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 2;
  border: none;
  background: white;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  font-size: 1.1rem;
  cursor: pointer;
}

/* IMAGEN */
.image {
  height: 180px;
  background: #dbeafe;
}

.image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* CONTENIDO */
.content {
  padding: 18px;
  text-align: center;
}

.title {
  margin: 10px 0;
  font-size: 1.2rem;
  font-weight: 800;
  color: #111827;
}

.desc {
  font-size: 0.95rem;
  color: #475569;
  margin-bottom: 12px;
}

.features {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 10px;
}

.features span {
  opacity: 0.3;
}

.features span.active {
  opacity: 1;
}

/* PRECIO */
.price {
  font-weight: 800;
  font-size: 1.1rem;
  color: #111827;
}

/* BOTÓN + */
.add-btn {
  position: absolute;
  bottom: 14px;
  right: 14px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: #34d399;
  color: white;
  font-size: 1.4rem;
  cursor: pointer;
}

.add-btn:hover {
  background: #10b981;
}
</style>