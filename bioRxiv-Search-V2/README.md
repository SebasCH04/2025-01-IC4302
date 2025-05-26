# bioRxiv-Search-V2

Estructura pensada del proyecto:


```bash
bioRxiv-Search-V2/
├── .github/                   # Configuración de GitHub (opcional)
│   └── workflows/            # GitHub Actions para CI/CD
│
├── charts/                    # Helm Charts para toda la solución
│   ├── controller/
│   ├── crawler/
│   ├── entity-extractor/
│   ├── spark-job/
│   └── rabbitmq/             # (Usar chart de Bitnami)
│
├── src/
│   ├── controller/           # Componente Controller (Python)
│   │   ├── main.py
│   │   ├── Dockerfile
│   │   └── requirements.txt
│   │
│   ├── crawler/              # API Crawler (Python)
│   │   ├── crawler.py
│   │   ├── Dockerfile
│   │   └── requirements.txt
│   │
│   ├── entity-extractor/     # Spacy NER (Python)
│   │   ├── extractor.py
│   │   ├── Dockerfile
│   │   └── requirements.txt
│   │
│   ├── spark-job/            # Spark SQL Processor (PySpark)
│   │   ├── transformations.py
│   │   ├── Dockerfile
│   │   └── requirements.txt
│   │
│   ├── api/                  # REST API (Node.js + Express)
│   │   ├── src/
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   └── frontend/             # Interfaz React (Vite + Tailwind)
│       ├── public/
│       ├── src/
│       ├── Dockerfile
│       └── package.json
│
├── infrastructure/
│   ├── k8s/                  # Configuraciones Kubernetes (no Helm)
│   │   ├── pv-shared-disk.yaml  # Persistent Volume (ReadWriteMany)
│   │   └── ingress.yaml
│   │
│   └── scripts/              # Scripts auxiliares (ej: data migration)
│
├── docs/                     # Documentación en Markdown
│   ├── architecture.md       # Diagramas de flujo/arquitectura
│   ├── setup-guide.md        # Instrucciones de instalación
│   ├── testing.md           # Pruebas unitarias y E2E
│   └── ai-design.md         # Proceso con IA generativa (prompts, screenshots)
│
├── tests/                    # Pruebas automatizadas
│   ├── unit/                 # Pruebas unitarias por componente
│   └── e2e/                 # Pruebas de integración
│
├── .dockerignore
├── .gitignore
├── docker-compose.yml        # Para desarrollo local (opcional)
├── Makefile                  # Comandos útiles (build, deploy, test)
└── README.md                 # Punto de entrada principal
```