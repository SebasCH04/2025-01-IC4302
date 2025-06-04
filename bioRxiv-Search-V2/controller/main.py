import os
import time
import json
import pika
from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime

def get_env_or_fail(name):
    value = os.getenv(name)
    if not value:
        raise ValueError(f"Falta variable de entorno requerida: {name}")
    return value

try:
    # Conexión a Mongo
    mongo_uri = get_env_or_fail("MONGO_URI")
    client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
    db = client.get_default_database()
    jobs_col = db.jobs

    # Conexión a RabbitMQ
    rabbit_url = get_env_or_fail("RABBITMQ_URL")
    params = pika.URLParameters(rabbit_url)
    conn = pika.BlockingConnection(params)
    channel = conn.channel()
    channel.queue_declare(queue="job-splits", durable=True)

    print("✅ Controller iniciado. Esperando jobs...")

    while True:
        try:
            # Toma un job no procesado o uno estancado en "processing"
            job = jobs_col.find_one_and_update(
                {
                    "$or": [
                        {"status": {"$exists": False}},
                        {
                            "status": "processing",
                            "updated_at": {"$lt": datetime.utcnow().timestamp() - 3600}  # 1 hora timeout
                        }
                    ]
                },
                {
                    "$set": {
                        "status": "processing",
                        "updated_at": datetime.utcnow().timestamp()
                    }
                }
            )

            if job:
                try:
                    total = job.get("total")
                    page_size = job.get("pageSize", 30)  # default a 30 como en crawler

                    if not total or page_size <= 0:
                        raise ValueError(f"Valores inválidos: total={total}, pageSize={page_size}")

                    splits = (total + page_size - 1) // page_size  # Redondeo hacia arriba
                    
                    message = {
                        "jobId": str(job["_id"]),
                        "splits": splits,
                        "pageSize": page_size,
                        "total": total
                    }

                    channel.basic_publish(
                        exchange="",
                        routing_key="job-splits",
                        body=json.dumps(message),
                        properties=pika.BasicProperties(
                            delivery_mode=2,
                            content_type='application/json'
                        )
                    )
                    print(f"✅ Publicado mensaje: {message}")
                    
                    jobs_col.update_one(
                        {"_id": job["_id"]},
                        {
                            "$set": {
                                "status": "queued",
                                "updated_at": datetime.utcnow().timestamp()
                            }
                        }
                    )
                except Exception as e:
                    print(f"❌ Error procesando job {job['_id']}: {e}")
                    jobs_col.update_one(
                        {"_id": job["_id"]},
                        {
                            "$set": {
                                "status": "error",
                                "error": str(e),
                                "updated_at": datetime.utcnow().timestamp()
                            }
                        }
                    )
            else:
                print("⏱️ No hay jobs nuevos. Durmiendo 5s…")
                time.sleep(5)

        except Exception as e:
            print(f"❌ Error en el ciclo principal: {e}")
            time.sleep(5)  # Esperar antes de reintentar

except Exception as e:
    print(f"❌ Error fatal: {e}")
    raise