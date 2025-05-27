biorxiv-search-v2/
├── .gitignore
├── README.md
│
├── helm/
│   ├── Chart.yaml
│   ├── values.yaml
│   └── templates/
│       ├── controller-deployment.yaml
│       ├── crawler-deployment.yaml
│       ├── spacy-deployment.yaml
│       └── spark-cronjob.yaml
│
├── controller/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── src/
│       └── main.py
│
├── crawler/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── src/
│       └── crawler.py
│
├── spacy_processor/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── src/
│       └── ner_extract.py
│
├── spark_job/
│   ├── Dockerfile
│   └── job.py
│
├── api/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       └── index.ts
│
├── ui/
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
│       ├── App.tsx
│       └── components/
│
└── documentacion/
    └── documentacion.md
