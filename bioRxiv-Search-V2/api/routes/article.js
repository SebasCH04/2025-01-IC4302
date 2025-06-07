const express = require("express");
const { ObjectId } = require("mongodb");
const { connectMongo } = require("../libs/mongoClient");
const validateToken = require("../middleware/validateToken");

const router = express.Router();

//GET /api/article/:id
router.get("/article/:id", validateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const db = await connectMongo();
    const coll = db.collection("documents");
    const doc = await coll.findOne({ _id: new ObjectId(id) });
    if (!doc) return res.status(404).json({ message: "Articulo no encontrado" });
    return res.json(doc);
  } catch (err) {
    console.error("Error en /article/:id", err);
    return res.status(500).json({ message: "Error interno" });
  }
});

module.exports = router;