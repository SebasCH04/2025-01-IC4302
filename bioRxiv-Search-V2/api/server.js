require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

//HEALTH CHECK / ROOT
app.get("/", (req, res) => {
  res.json({ message: "API viva - listo para recibir peticiones" });
});

//rutas definidas para /api/...
const authRoutes = require("./routes/auth");
const searchRoutes = require("./routes/search");
const articleRoutes = require("./routes/article");

app.use("/api", authRoutes);
app.use("/api", searchRoutes);
app.use("/api", articleRoutes);

//ejemplo de ruta de busqueda usando regex
app.get('/api/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Parámetro query es obligatorio" });
    }
    //busca en title y abstract de forma case-insensitive
    const regex = new RegExp(query, "i");
    const results = await db.collection("documents").find({
      $or: [
        { title: { $regex: regex } },
        { abstract: { $regex: regex } }
      ]
    }).toArray();

    res.json({
      page: 1,
      pageSize: 10,
      totalCount: results.length,
      results
    });
  } catch (err) {
    console.error("Error en /api/search:", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

//manejador generico de errores
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Error interno del servidor" });
});

//exportar un handler para serverless que invoque a la app Express
module.exports = (req, res) => {
  return app(req, res);
};