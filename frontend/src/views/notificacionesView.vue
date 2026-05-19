<script setup>
import headerBar from "../components/headerBar.vue";
</script>

<template>
  <headerBar />

  <section class="page">
    <div class="card">
      <p class="eyebrow">WE TRIP</p>
      <h1>Notificaciones</h1>
    </div>
  </section>
</template>

<style scoped>
.page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background:
    radial-gradient(circle at top left, rgba(59, 130, 246, 0.12), transparent 28%),
    linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%);
}

.card {
  width: 100%;
  max-width: 700px;
  padding: 40px;
  background: white;
  border-radius: 24px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
  text-align: center;
}

.eyebrow {
  margin-bottom: 10px;
  color: #2563eb;
  font-weight: 800;
  letter-spacing: 0.08em;
}

h1 {
  margin-bottom: 12px;
  color: #0f172a;
}
</style>