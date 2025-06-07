const express = require("express");
const { connectMongo } = require("../libs/mongoClient");
const router = express.Router();
const validateToken = require("../middleware/validateToken");

// GET /api/search?query=texto&category=immunology&type=new+results&page=1&pageSize=10
router.get("/search", validateToken, async (req, res) => {
  const {
    query = "",
    category,
    type,
    author,
    entity,
    dateFrom,
    dateTo,
    page = 1,
    pageSize = 10,
  } = req.query;

  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);

  try {
    const db = await connectMongo();
    const coll = db.collection("documents");

    // Construimos el pipeline de agregacion con $search
    const mustClauses = [];
    if (query) {
      mustClauses.push({
        text: {
          query: query,
          path: ["title", "abstract", "entities.text"],
        },
      });
    }
    if (category) {
      mustClauses.push({
        equals: { path: "category", value: category },
      });
    }
    if (type) {
      mustClauses.push({
        equals: { path: "type", value: type },
      });
    }
    if (author) {
      mustClauses.push({
        equals: { path: "authors", value: author },
      });
    }
    if (entity) {
      mustClauses.push({
        equals: { path: "entities.text", value: entity },
      });
    }
    if (dateFrom || dateTo) {
      const rangeFilter = { path: "date" };
      if (dateFrom) rangeFilter["gte"] = new Date(dateFrom);
      if (dateTo) rangeFilter["lte"] = new Date(dateTo);
      mustClauses.push({ range: rangeFilter });
    }

    const searchStage = {
      $search: {
        compound: {
          must: mustClauses,
        },
        highlight: { path: ["title", "abstract"] },
      },
    };

    console.log(
      "Pipeline de búsqueda:",
      JSON.stringify([searchStage, { $skip: skip }, { $limit: limit }], null, 2)
    );

    const cursor = coll.aggregate([
      searchStage,
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          _id: 1,
          title: 1,
          abstract: 1,
          date: 1,
          category: 1,
          type: 1,
          authors: 1,
          entities: 1,
          highlights: { $meta: "searchHighlights" },
        },
      },
    ]);

    const results = await cursor.toArray(); // Cambiar esta línea

    const countCursor = await coll.aggregate([
      { $search: { compound: { must: mustClauses } } },
      { $count: "count" },
    ]).toArray();
    const totalCount = countCursor[0]?.count || 0;

    return res.json({
      page: Number(page),
      pageSize: Number(pageSize),
      totalCount: totalCount,
      results,
    });
  } catch (err) {
    console.error("Error en /search:", err);
    return res.status(500).json({ message: "Error interno en busqueda" });
  }
});

module.exports = router;