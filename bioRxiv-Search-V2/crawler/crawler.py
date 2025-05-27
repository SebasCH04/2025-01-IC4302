import os
import json
import pika
import requests
import ast

RABBITMQ_URL = os.getenv("RABBITMQ_URL")
params = pika.URLParameters(RABBITMQ_URL)
conn   = pika.BlockingConnection(params)
ch     = conn.channel()
ch.queue_declare(queue="job-splits", durable=True)

API_URL = "https://api.biorxiv.org/covid19"  # ejemplo

print("Crawler iniciado: escuchando job-splits…")

for method, properties, body in ch.consume("job-splits", inactivity_timeout=5):
    if body is None:
        continue

    raw = body.decode("utf-8")
    try:
        msg = json.loads(raw)
    except json.JSONDecodeError:
        # si no es JSON válido, caemos en literal_eval
        msg = ast.literal_eval(raw)

    job_id = msg["jobId"]
    splits = msg["splits"]
    print(f"Recibido job {job_id} con {splits} splits")

    # Ejemplo: obtener el primer split
    page_size = 30  # el API de covid19 devuelve 30 ítems por página por defecto

    for split_idx in range(splits):
        offset = split_idx * page_size
        url = f"{API_URL}/{offset}"
        resp = requests.get(url)
        data = resp.json()
        params = {"page": split_idx + 1, "pageSize": 10}
        resp = requests.get(API_URL, params=params)
        raw_dir = "/raw"
        os.makedirs(raw_dir, exist_ok=True)
        filename = f"{raw_dir}/{job_id}-{split_idx+1}.json"
        with open(filename, "w") as f:
            json.dump(resp.json(), f)
        print(f"Guardado {filename}")

    # Acusar recibo
    ch.basic_ack(method.delivery_tag)