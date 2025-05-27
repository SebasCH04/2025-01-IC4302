import os
import time
import json
import pika
from pymongo import MongoClient
from bson.objectid import ObjectId

# Conexión a Mongo
mongo_uri = os.getenv("MONGO_URI")
client    = MongoClient(mongo_uri)
db        = client.get_default_database()
jobs_col  = db.jobs

# Conexión a RabbitMQ
rabbit_url = os.getenv("RABBITMQ_URL")
params     = pika.URLParameters(rabbit_url)
conn       = pika.BlockingConnection(params)
channel    = conn.channel()
channel.queue_declare(queue="job-splits", durable=True)

print("✅ Controller iniciado. Esperando jobs...")

while True:
    # Toma un job no procesado
    job = jobs_col.find_one_and_update(
        {"status": {"$exists": False}},
        {"$set": {"status": "processing"}}
    )
    if job:
        splits  = job.get("total", 0) // job.get("pageSize", 1)
        message = {"jobId": str(job["_id"]), "splits": splits}
        channel.basic_publish(
            exchange="",
            routing_key="job-splits",
            body=json.dumps(message),
            properties=pika.BasicProperties(delivery_mode=2)
        )
        print("Publicado mensaje:", message)
        # Marca como hecho
        jobs_col.update_one({"_id": job["_id"]}, {"$set": {"status": "done"}})
    else:
        print("⏱️ No hay jobs nuevos. Durmiendo 5s…")
        time.sleep(5)