const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("Debes definir MONGODB_URI en tus variables de entorno.");
}

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function connectMongo() {
  if (!client.isConnected()) {
    await client.connect();
  }
  return client.db("projectDB"); // la DB donde Atlas Search está indexando
}

module.exports = { connectMongo };