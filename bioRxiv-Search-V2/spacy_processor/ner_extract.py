import os
import json
import time
from glob import glob
import spacy

# Carga el modelo
nlp = spacy.load("en_core_web_sm")

RAW_DIR       = "/raw"
AUGMENTED_DIR = "/augmented"

# Asegurarse de que existan las carpetas necesarias
os.makedirs(AUGMENTED_DIR, exist_ok=True)
os.makedirs(os.path.join(RAW_DIR, "processed"), exist_ok=True)

def extract_entities(text):
    doc = nlp(text)
    return [
        {"text": ent.text, "label": ent.label_, "start": ent.start_char, "end": ent.end_char}
        for ent in doc.ents
    ]

print("Spacy Processor iniciado: vigilando /raw …")

while True:
    # Solo listamos archivos *.json directamente en /raw, sin entrar en /raw/processed
    raw_files = sorted(glob(os.path.join(RAW_DIR, "*.json")))

    if not raw_files:
        print("No hay archivos JSON en /raw. Esperando 5s…")
        time.sleep(5)
        continue

    for filepath in raw_files:
        filename = os.path.basename(filepath)
        print(f"Procesando {filename} …")

        # Leer el JSON crudo
        try:
            with open(filepath, "r") as f:
                data = json.load(f)
        except Exception as e:
            print(f"Error al leer {filename}: {e}. Se omite.")
            # Si deseas, podrías moverlo a /raw/processed para no eternamente reprocesarlo
            os.rename(filepath, os.path.join(RAW_DIR, "processed", filename))
            continue

        # Extraer entidades
        for article in data.get("collection", []):
            text_to_analyze = (article.get("rel_title", "") or "") + "\n" + (article.get("rel_abs", "") or "")
            ents = extract_entities(text_to_analyze)
            article["entities"] = ents

        # Guardar JSON enriquecido
        out_path = os.path.join(AUGMENTED_DIR, filename)
        try:
            with open(out_path, "w") as f:
                json.dump(data, f)
            print(f"Guardado enriquecido en {out_path}")
        except Exception as e:
            print(f"No se pudo escribir {filename} en /augmented: {e}")

        # Mover el archivo crudo a /raw/processed/ (una sola operación)
        processed_dir = os.path.join(RAW_DIR, "processed")
        dest_path = os.path.join(processed_dir, filename)
        try:
            os.rename(filepath, dest_path)
            print(f"Movido {filename} a /raw/processed")
        except FileNotFoundError:
            # Si por alguna razón ya no existe en /raw, ignoramos
            print(f"El archivo {filename} ya no existía en /raw al intentar moverlo.")
        except Exception as e:
            print(f"No se pudo mover {filename} a /raw/processed: {e}")

    print("Ciclo de procesamiento terminado. Esperando 5s…")
    time.sleep(5)