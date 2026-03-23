<script setup>
const props = defineProps({
  plan: {
    type: Object,
    required: true
  },
  seleccionado: {
    type: Boolean,
    default: false
  },
  maximoAlcanzado: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["toggle-seleccion", "toggle-favorito"]);

const onSeleccionar = () => {
  if (!props.seleccionado && props.maximoAlcanzado) return;
  emit("toggle-seleccion", props.plan);
};

const onFavorito = () => {
  emit("toggle-favorito", props.plan);
};
</script>

<template>
  <article class="plan-card" :class="{ selected: seleccionado }">
    <button class="favorite-btn" @click="onFavorito" aria-label="Guardar en favoritos">
      ♥
    </button>

    <div class="image-wrapper">
      <img
        :src="plan.imagen || 'https://via.placeholder.com/500x300?text=WE+TRIP'"
        :alt="`${plan.destinoId?.ciudad || 'Destino'} ${plan.destinoId?.pais || ''}`"
      />
      <span v-if="seleccionado" class="selected-badge">Seleccionado</span>
    </div>

    <div class="card-content">
      <h3 class="title">
        {{ plan.destinoId?.ciudad || "Destino" }}, {{ plan.destinoId?.pais || "País" }}
      </h3>

      <p class="description">
        {{ plan.descripcion || "Plan de viaje personalizado." }}
      </p>

      <div class="features">
        <span :class="{ active: plan.incluye?.transporte }">Transporte</span>
        <span :class="{ active: plan.incluye?.alojamiento }">Alojamiento</span>
        <span :class="{ active: plan.incluye?.rutas }">Rutas</span>
      </div>

      <div class="info-row">
        <p class="price">{{ plan.precioBasePorPersona }} € <small>/ persona</small></p>
        <p class="capacity">Máx. {{ plan.maxPersonas }} personas</p>
      </div>

      <button
        class="select-btn"
        :class="{ disabled: !seleccionado && maximoAlcanzado }"
        @click="onSeleccionar"
      >
        {{ seleccionado ? "Quitar opción" : "Añadir opción" }}
      </button>
    </div>
  </article>
</template>

<style scoped>
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
</style>