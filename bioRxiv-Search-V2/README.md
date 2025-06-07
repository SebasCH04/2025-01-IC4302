# Proyecto II: bioRxiv-Search para búsquedas de artículos sobre el COVID-19

### Estructura del proyecto:
```bash
biorxiv-search-v2/
├── api/
│   ├── libs/
│   │   ├── firebaseAdmin.js
│   │   └── mongoClient.js
│   ├── middleware/
│   │   └── validateToken.js
│   ├── node_modules/
│   ├── routes/
│   │   ├── article.js
│   │   ├── auth.js
│   │   └── search.js
│   ├── .env
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
│
├── controller/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── main.py
│
├── crawler/
│   ├── crawler.py
│   ├── Dockerfile
│   └── requirements.txt
│
├── documentation/
│   └── documentacion.md
│
├── helm/
│   ├── charts/
│   │   ├── mongodb-16.5.5.yaml
│   │   └── rabbitmq-12.10.0.yaml
│   ├── templates/
│   │   ├── controller-deployment.yaml
│   │   ├── crawler-deployment.yaml
│   │   ├── pvc-augmented.yaml
│   │   ├── pvc-raw.yaml
│   │   ├── spacy-deployment.yaml
│   │   └── spark-cronjob.yaml
│   ├── values.yaml
│   └── Chart.yaml
│
├── spacy_processor/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── ner_extract.py
│
├── spark_job/
│   ├── Dockerfile
│   ├── job.py
│   └── requirements.txt
│
├── ui/
│   ├── node_modules/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── ResultsList.js
│   │   │   ├── SearchBar.js
│   │   │   └── SearchPage.js
│   │   ├── styles/
│   │   │   └── App.css
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── UserContext.js
│   ├── package-lock.json
│   └── package.json
│
├── .gitignore
├── LICENSE
└── README.md
```
