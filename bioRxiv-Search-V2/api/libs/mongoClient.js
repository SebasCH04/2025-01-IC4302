const { MongoClient } = require("mongodb");

let cachedClient = null;
let cachedDb = null;

async function connectMongo() {
  try {
    //si ya existe una conexion previa y sigue abierta, devolvemos cachedDb
    if (cachedClient && cachedClient.topology && cachedClient.topology.isConnected()) {
      return cachedDb;
    }

    //sino, creamos un nuevo cliente y nos conectamos
    const client = new MongoClient(process.env.MONGODB_URI, {
      useUnifiedTopology: true
    });
    await client.connect();

    //nombre de la base
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