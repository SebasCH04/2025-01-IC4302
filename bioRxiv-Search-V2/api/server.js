require("dotenv").config(); // carga variables desde .env
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const searchRoutes = require("./routes/search");
const articleRoutes = require("./routes/article");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", searchRoutes);
app.use("/api", articleRoutes);

// Error handler genérico
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Error interno del servidor" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`REST API corriendo en puerto ${PORT}`);
});

app.get("/", (req, res) => {
  res.json({ message: "API viva" });
});