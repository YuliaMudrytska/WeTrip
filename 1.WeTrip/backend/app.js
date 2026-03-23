const express = require("express");
const app = express();

app.use(express.json());

// Rutas
app.use("/api/planes", require("./routes/planesRoutes"));
app.use("/api/search", require("./routes/searchRoutes"));
app.use("/api/formulario", require("./routes/formularioRoutes"));
app.use("/api/planes", require("./routes/planesRoutes"));

module.exports = app;