FROM python:3.10-slim

WORKDIR /app

# Instala SpaCy y modelo (puede tardar un poco)
RUN pip install --no-cache-dir spacy
RUN python -m spacy download en_core_web_sm

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ner_extract.py .

# El script se ejecutará en un único contenedor que vigila /raw y escribe en /augmented
CMD ["python", "-u", "ner_extract.py"]