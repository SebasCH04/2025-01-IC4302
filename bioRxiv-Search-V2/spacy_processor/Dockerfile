FROM python:3.10-slim

WORKDIR /app

RUN pip install --no-cache-dir spacy
RUN python -m spacy download en_core_web_sm

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ner_extract.py .

CMD ["python", "-u", "ner_extract.py"]