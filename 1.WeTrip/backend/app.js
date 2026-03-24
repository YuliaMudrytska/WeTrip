const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/search", require("./routes/searchRoutes"));
app.use("/api/formulario", require("./routes/formularioRoutes"));
app.use("/api/planes", require("./routes/planesRoutes"));
app.use("/api/favoritos", require("./routes/favoritosRoutes"));
app.use("/api/reservas", require("./routes/reservasRoutes"));

module.exports = app;