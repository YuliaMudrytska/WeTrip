<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../api/api";
import headerBar from "../components/headerBar.vue";

const router = useRouter();

const destino = ref("");
const cargando = ref(false);
const error = ref("");

const buscarDestino = async () => {
  error.value = "";

  const destinoLimpio = destino.value.trim();

  if (!destinoLimpio) {
    error.value = "Introduce un destino para continuar.";
    return;
  }

  try {
    cargando.value = true;

    const { data } = await api.post("/search", {
      destino: destinoLimpio
    });

    // Usuario no logueado -> formulario normal
    if (!data.estaLogueado) {
      router.push({
        path: "/formulario",
        query: {
          destino: destinoLimpio
        }
      });
      return;
    }

    // Usuario logueado, pero no existe historial -> formulario normal
    if (data.estaLogueado && !data.existeHistorial) {
      router.push({
        path: "/formulario",
        query: {
          destino: destinoLimpio
        }
      });
      return;
    }

    // Usuario logueado y con historial
    if (data.estaLogueado && data.existeHistorial && data.ultimaBusqueda) {
      const quiereModificar = window.confirm(
        "Ya habías buscado este destino. ¿Quieres cambiar algo del formulario?"
      );

      if (quiereModificar) {
        router.push({
          path: "/formulario",
          query: {
            data: JSON.stringify(data.ultimaBusqueda)
          }
        });
        return;
      }

      // Si no quiere modificar, ir directamente a planes usando la búsqueda previa
      router.push({
        path: "/planes",
        query: {
          id: data.ultimaBusqueda._id
        }
      });
    }
  } catch (err) {
    console.error(err);
    error.value = "No se pudo realizar la búsqueda. Inténtalo de nuevo.";
  } finally {
    cargando.value = false;
  }
};
</script>

<template>
  <headerBar />
  <section class="home-page">
    <div class="hero-card">
      <p class="eyebrow">WE TRIP</p>

      <h1>Organiza tu viaje de forma más fácil y ajustada a tu presupuesto</h1>

      <p class="hero-text">
        Busca tu destino, rellena tu formulario y descubre opciones de viaje
        pensadas para ti.
      </p>

      <div class="search-box">
        <input
          v-model="destino"
          type="text"
          placeholder="Introduce tu destino"
          @keyup.enter="buscarDestino"
        />

        <button @click="buscarDestino" :disabled="cargando">
          {{ cargando ? "Buscando..." : "Buscar" }}
        </button>
      </div>

      <p v-if="error" class="error-message">
        {{ error }}
      </p>

      <div class="hero-info">
        <div class="info-pill">Búsqueda rápida</div>
        <div class="info-pill">Planes por presupuesto</div>
        <div class="info-pill">Comparación de opciones</div>
      </div>
    </div>

    <div class="featured-section">
      <div class="featured-card">
        <span class="featured-tag">Destinos populares</span>
        <h2>Ideas para empezar</h2>

        <div class="destinations-grid">
          <button class="destination-item" @click="destino = 'Ámsterdam, Países Bajos'; buscarDestino()">
            Ámsterdam, Países Bajos
          </button>

          <button class="destination-item" @click="destino = 'Tokio, Japón'; buscarDestino()">
            Tokio, Japón
          </button>

          <button class="destination-item" @click="destino = 'Bogotá, Colombia'; buscarDestino()">
            Bogotá, Colombia
          </button>

          <button class="destination-item" @click="destino = 'Segovia, España'; buscarDestino()">
            Segovia, España
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-page {
  min-height: 100vh;
  padding: 40px 24px 60px;
  background:
    radial-gradient(circle at top left, rgba(59, 130, 246, 0.14), transparent 28%),
    linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%);
}

.hero-card {
  max-width: 1000px;
  margin: 0 auto 28px;
  padding: 48px 32px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(219, 234, 254, 0.9);
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
  text-align: center;
}

.eyebrow {
  margin: 0 0 10px;
  color: #2563eb;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.hero-card h1 {
  margin: 0 auto 16px;
  max-width: 860px;
  font-size: clamp(2rem, 5vw, 3.5rem);
  line-height: 1.08;
  color: #0f172a;
}

.hero-text {
  max-width: 760px;
  margin: 0 auto 28px;
  color: #475569;
  font-size: 1.05rem;
  line-height: 1.7;
}

.search-box {
  max-width: 760px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 14px;
  padding: 12px;
  background: white;
  border-radius: 22px;
  border: 1px solid #dbeafe;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.search-box input {
  border: none;
  outline: none;
  font-size: 1rem;
  padding: 16px 18px;
  border-radius: 16px;
  background: #f8fafc;
  color: #0f172a;
}

.search-box button {
  border: none;
  padding: 0 24px;
  border-radius: 16px;
  background: #2563eb;
  color: white;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  min-height: 56px;
  box-shadow: 0 12px 26px rgba(37, 99, 235, 0.28);
}

.search-box button:disabled {
  background: #94a3b8;
  cursor: not-allowed;
  box-shadow: none;
}

.error-message {
  margin: 16px 0 0;
  color: #b91c1c;
  font-weight: 600;
}

.hero-info {
  margin-top: 26px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}

.info-pill {
  padding: 10px 16px;
  border-radius: 999px;
  background: #dbeafe;
  color: #1d4ed8;
  font-size: 0.95rem;
  font-weight: 700;
}

.featured-section {
  max-width: 1000px;
  margin: 0 auto;
}

.featured-card {
  background: white;
  border-radius: 26px;
  padding: 28px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
}

.featured-tag {
  display: inline-block;
  margin-bottom: 12px;
  color: #2563eb;
  font-weight: 700;
}

.featured-card h2 {
  margin: 0 0 18px;
  color: #0f172a;
  font-size: 1.5rem;
}

.destinations-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.destination-item {
  padding: 18px;
  border-radius: 18px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #334155;
  font-weight: 600;
  cursor: pointer;
  text-align: left;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.destination-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 18px rgba(15, 23, 42, 0.06);
}

@media (max-width: 760px) {
  .hero-card {
    padding: 36px 20px;
  }

  .search-box {
    grid-template-columns: 1fr;
  }

  .search-box button {
    width: 100%;
  }

  .destinations-grid {
    grid-template-columns: 1fr;
  }
}
</style>