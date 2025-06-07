# Documentación del proyecto bioRxiv-Search-V2

## Bases de Datos II

### Instituto Tecnológico de Costa Rica

#### Semestre I, 2025

---

**Autores**

- Sebastián Calvo - 
- Franco Rojas - 2022437823

---

**Profesor**

- Gerardo Nereo Campos Araya

---

**Fecha de Entrega**

- 06/06/2025

---

**Resumen** 

Este documento describe la arquitectura, los componentes, la instalación, el despliegue y el uso del proyecto bioRxiv Search V2, una solución de búsqueda de artículos científicos de COVID-19 basada en microservicios con bases de datos SQL/NoSQL, orquestada con Kubernetes y Helm.

---

**Tabla de Contenidos:**

1. [Introducción](#introducción)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Despliegue](#despliegue)
4. [Pruebas](#pruebas)
5. [Recomendaciones](#recomendaciones)
6. [Conclusiones](#conclusiones)
7. [Referencias]()

---

## Introducción

*bioXiv-Search-V2*, es un proyecto cuyo objetivo es implementar un motor de búsqueda de artículos científicos de Covid-19 utilizando la base de datos NoSQL llamada Mongo Atlas Search, para este propósito utilizaremos un repositorio de descripciones de artículos científicos llamada bioRxiv, específicamente su API.

---

## Estructura del Proyecto

```bash
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
└── ui/
    ├── package.json
    ├── vite.config.ts
    └── src/
        ├── App.tsx
        └── components/
```

## Despliegue

### Requisitos

- Docker Desktop / Minikube
- Helm
- Kubernetes
- Git
- Node.js (v14 o superior)
- npm
- Cuenta de MongoDB Atlas
- Proyecto de Firebase

## Instalación y configuración

## Pruebas

## Recomendaciones

- **Automatizar pruebas continuas**: Implementar pipelines de CI/CD que ejecuten tests unitarios e integración para asegurar la calidad en cada merge.

- **Monitoreo y alertas**: Integrar Prometheus y Grafana en cada microservicio para capturar métricas críticas y configurar alertas tempranas.

- **Optimización de índices**: Revisar y ajustar periódicamente los índices de MongoDB Atlas Search según el volumen y patrón de consultas.

- **Gestión de secretos**: Utilizar Vault o Kubernetes Secrets para almacenar credenciales y evitar exponer variables en texto plano.

- **Balanceo de carga**: Configurar Ingress y servicios de tipo LoadBalancer para distribuir tráfico de forma eficiente.

- **Escalabilidad automática**: Definir HPA (Horizontal Pod Autoscaler) en Kubernetes según métricas de CPU o latencia.

- **Revisión de seguridad**: Ejecutar escaneos de vulnerabilidades en imágenes Docker y dependencias NPM/Python regularmente.

- **Documentación continua**: Mantener actualizadas las referencias de API y manuales de usuario, generando documentación automática (Swagger/OpenAPI).

- **Gestión de logs centralizada**: Enviar logs a un sistema central (ELK/EFK) para facilitar búsqueda y correlación de eventos.

- **Pruebas de carga**: Realizar pruebas con herramientas como JMeter o k6 para validar el comportamiento bajo alta concurrencia.

## Conclusiones

- El diseño modular basado en microservicios facilitó el desarrollo paralelo y la escalabilidad independiente de cada componente.
- La adopción de MongoDB Atlas Search mejoró significativamente la relevancia y velocidad de las búsquedas faceted.
- La extracción de entidades con SpaCy enriqueció los metadatos, permitiendo búsquedas más semánticas.
- Spark permitió procesar y normalizar grandes volúmenes de datos de manera eficiente con CronJobs.
- La UI React/Vite/Tailwind ofreció una experiencia de usuario fluida y adaptable a dispositivos móviles.
- Las recomendaciones futuras apuntan a mejorar la observabilidad, la seguridad y la automatización total del ciclo de vida.

## Referencias

- [Kubernetes](https://kubernetes.io/docs/)
- [Helm](https://helm.sh/docs/)