const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.get("/", (req, res) => {
  res.send("API de WeTrip funcionando");
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/search", require("./routes/searchRoutes"));
app.use("/api/formulario", require("./routes/formularioRoutes"));
app.use("/api/planes", require("./routes/planesRoutes"));
app.use("/api/favoritos", require("./routes/favoritosRoutes"));
app.use("/api/reservas", require("./routes/reservasRoutes"));
app.use("/api/propuestas", require("./routes/propuestasRoutes"));

app.use((req, res) => {
  res.status(404).json({ msg: "Ruta no encontrada" });
});

module.exports = app;