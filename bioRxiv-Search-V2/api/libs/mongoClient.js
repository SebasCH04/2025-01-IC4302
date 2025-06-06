const { MongoClient } = require("mongodb");

let cachedClient = null;
let cachedDb = null;

async function connectMongo() {
  try {
    // Si ya existe una conexión previa y sigue abierta, devolvemos cachedDb
    if (cachedClient && cachedClient.topology && cachedClient.topology.isConnected()) {
      return cachedDb;
    }

    // Sino, creamos un nuevo cliente y nos conectamos
    const client = new MongoClient(process.env.MONGODB_URI, {
      useUnifiedTopology: true
    });
    await client.connect();

    // Nombre de la base; puede venir de env o fijo aquí
    const dbName = process.env.MONGODB_DBNAME || "projectDB";
    const db = client.db(dbName);

    cachedClient = client;
    cachedDb = db;
    return db;
  } catch (err) {
    console.error("Error conectando a MongoDB:", err);
    throw err;
  }
}

module.exports = { connectMongo };