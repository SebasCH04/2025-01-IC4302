import os
import time
import json
import pika
from pika.exceptions import StreamLostError
from pymongo import MongoClient
from bson.objectid import ObjectId

def connect_rabbit():
    rabbit_url = os.getenv("RABBITMQ_URL")
    params     = pika.URLParameters(rabbit_url)
    params.heartbeat = 60 #heartbeat cada 60 segundos
    params.blocked_connection_timeout = 120 #tiempo de espera al broker
    connection = pika.BlockingConnection(params)
    channel    = connection.channel()
    channel.queue_declare(queue="job-splits", durable=True)
    return connection, channel

# Conexión a Mongo
mongo_uri = os.getenv("MONGO_URI")
client    = MongoClient(mongo_uri)
db        = client.get_default_database()
jobs_col  = db.jobs

# Conexión inicial a RabbitMQ
conn, channel = connect_rabbit()

print("Controller iniciado. Esperando jobs...")

while True:
    # Toma un job no procesado
    job = jobs_col.find_one_and_update(
        {"status": {"$exists": False}},
        {"$set": {"status": "processing"}}
    )
    if job:
        splits  = job.get("total", 0) // job.get("pageSize", 1)
        message = {"jobId": str(job["_id"]), "splits": splits}
        try:
            channel.basic_publish(
                exchange="",
                routing_key="job-splits",
                body=json.dumps(message),
                properties=pika.BasicProperties(delivery_mode=2)
            )
            print("Publicado mensaje:", message)
            # Marca como hecho
            jobs_col.update_one({"_id": job["_id"]}, {"$set": {"status": "done"}})
        except StreamLostError:
            print("Conexión con RabbitMQ perdida, reintentando en 5s...")
            try:
                conn.close()
            except:
                pass
            time.sleep(5)
            conn, channel = connect_rabbit()
            # Reintentar publicación tras reconectar
            channel.basic_publish(
                exchange="",
                routing_key="job-splits",
                body=json.dumps(message),
                properties=pika.BasicProperties(delivery_mode=2)
            )
            print("Publicado mensaje tras reconectar:", message)
            jobs_col.update_one({"_id": job["_id"]}, {"$set": {"status": "done"}})
    else:
        print("No hay jobs nuevos. Durmiendo 5s...")
        time.sleep(5)