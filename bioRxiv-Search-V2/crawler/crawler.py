import os
import json
import time
import requests
import pika
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

def get_env_or_fail(name):
    value = os.getenv(name)
    if not value:
        raise ValueError(f"Falta variable de entorno requerida: {name}")
    return value

def setup_session():
    session = requests.Session()
    retry = Retry(
        total=3,
        backoff_factor=0.5,
        status_forcelist=[500, 502, 503, 504],
        allowed_methods=["GET"]
    )
    adapter = HTTPAdapter(max_retries=retry)
    session.mount('http://', adapter)
    session.mount('https://', adapter)
    return session

try:
    RABBITMQ_URL = get_env_or_fail("RABBITMQ_URL")
    API_URL = get_env_or_fail("API_URL", "https://api.biorxiv.org/covid19")
    RAW_DIR = get_env_or_fail("RAW_DIR", "/raw")
    
    # Crear directorio para los archivos
    os.makedirs(RAW_DIR, exist_ok=True)

    # Configurar RabbitMQ
    params = pika.URLParameters(RABBITMQ_URL)
    conn = pika.BlockingConnection(params)
    ch = conn.channel()
    ch.queue_declare(queue="job-splits", durable=True)
    ch.basic_qos(prefetch_count=1)  # Procesar un mensaje a la vez

    # Configurar sesión HTTP con reintentos
    session = setup_session()

    print("✅ Crawler iniciado: escuchando job-splits…")

    def process_message(ch, method, properties, body):
        if not body:
            return

        try:
            msg = json.loads(body.decode("utf-8"))
            job_id = msg["jobId"]
            splits = msg["splits"]
            page_size = msg.get("pageSize", 30)
            total = msg.get("total", splits * page_size)

            print(f"📥 Recibido job {job_id} con {splits} splits (total: {total}, page_size: {page_size})")

            for split_idx in range(splits):
                offset = split_idx * page_size
                # Verificar si ya procesamos todos los items
                if offset >= total:
                    print(f"✅ Alcanzado el total de items ({total}). Terminando.")
                    break

                params = {
                    "offset": offset,
                    "limit": min(page_size, total - offset)  # No pedir más del total restante
                }

                try:
                    resp = session.get(API_URL, params=params, timeout=10)
                    resp.raise_for_status()
                    data = resp.json()

                    filename = os.path.join(RAW_DIR, f"{job_id}-{split_idx+1}.json")
                    with open(filename, "w", encoding="utf-8") as f:
                        json.dump(data, f, ensure_ascii=False, indent=2)
                    print(f"💾 Guardado {filename}")

                    # Rate limiting
                    time.sleep(1)

                except requests.exceptions.RequestException as e:
                    print(f"❌ Error en request para split {split_idx}: {e}")
                    if isinstance(e, requests.exceptions.HTTPError) and e.response.status_code >= 500:
                        print("Error del servidor, reintentando mensaje completo...")
                        ch.basic_reject(method.delivery_tag, requeue=True)
                        return
                    else:
                        print("Error de cliente o red, continuando con siguiente split...")
                        continue

            # Todo el proceso fue exitoso
            ch.basic_ack(method.delivery_tag)
            print(f"✅ Procesamiento completo del job {job_id}")

        except json.JSONDecodeError as e:
            print(f"❌ Error decodificando mensaje: {e}")
            # Rechazar mensaje como no procesable
            ch.basic_reject(method.delivery_tag, requeue=False)

        except Exception as e:
            print(f"❌ Error procesando mensaje: {e}")
            # Reintentar mensaje
            ch.basic_reject(method.delivery_tag, requeue=True)

    # Configurar consumidor
    ch.basic_consume(queue="job-splits", on_message_callback=process_message)
    
    # Iniciar consumo
    try:
        ch.start_consuming()
    except KeyboardInterrupt:
        print("\n🛑 Deteniendo crawler...")
        ch.stop_consuming()
    
except Exception as e:
    print(f"❌ Error fatal: {e}")
    raise