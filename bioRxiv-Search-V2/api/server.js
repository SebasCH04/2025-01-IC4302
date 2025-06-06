require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ** HEALTH CHECK / ROOT **
app.get("/", (req, res) => {
  res.json({ message: "API viva ‒ listo para recibir peticiones" });
});

// Rutas definidas para /api/...
const authRoutes = require("./routes/auth");
const searchRoutes = require("./routes/search");
const articleRoutes = require("./routes/article");

app.use("/api", authRoutes);
app.use("/api", searchRoutes);
app.use("/api", articleRoutes);

// Manejador genérico de errores
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Error interno del servidor" });
});

module.exports = app;