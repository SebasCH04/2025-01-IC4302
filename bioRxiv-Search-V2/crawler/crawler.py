import os
import json
import ast
import time
import requests
import pika

RABBITMQ_URL = os.getenv("RABBITMQ_URL")
params       = pika.URLParameters(RABBITMQ_URL)
conn         = pika.BlockingConnection(params)
ch           = conn.channel()
ch.queue_declare(queue="job-splits", durable=True)

API_URL   = "https://api.biorxiv.org/covid19"
PAGE_SIZE = 30   # El endpoint covid19 devuelve 30 resultados por página

print("Crawler iniciado: escuchando job-splits…")

for method, properties, body in ch.consume("job-splits", inactivity_timeout=5):
    if body is None:
        # no hay mensajes nuevos
        print("Sin mensajes, vuelvo a esperar…")
        time.sleep(5)
        continue

    # Parseo del mensaje (JSON o literal‐eval)
    raw = body.decode("utf-8")
    try:
        msg = json.loads(raw)
    except json.JSONDecodeError:
        msg = ast.literal_eval(raw)

    job_id = msg["jobId"]
    splits = msg["splits"]
    print(f"Recibido job {job_id} con {splits} splits")

    for split_idx in range(splits):
        offset = split_idx * PAGE_SIZE
        url    = f"{API_URL}/{offset}"

        try:
            resp = requests.get(url, timeout=10)
        except requests.RequestException as e:
            print(f"Error de red al llamar {url}: {e}. Sigo al siguiente split.")
            continue

        if resp.status_code != 200:
            print(f"El endpoint {url} devolvió status {resp.status_code}. Termino bucle de splits.")
            break

        # Intento parsear como JSON
        try:
            data = resp.json()
        except ValueError:
            print(f"La respuesta de {url} no es JSON (texto: {resp.text[:100]!r}). Lo salto.")
            continue

        # Si llegaste aquí, 'data' es un dict con el JSON esperado
        raw_dir = "/raw"
        os.makedirs(raw_dir, exist_ok=True)
        filename = f"{raw_dir}/{job_id}-{split_idx+1}.json"
        with open(filename, "w") as f:
            json.dump(data, f)
        print(f"Guardado {filename}")

    # Confirmo procesamiento del mensaje y continuo escuchando
    ch.basic_ack(method.delivery_tag)