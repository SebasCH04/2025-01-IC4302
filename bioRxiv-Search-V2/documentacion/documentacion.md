# Documentación del proyecto II: bioRxiv-Search-V2

## Bases de Datos II

### Instituto Tecnológico de Costa Rica

#### Semestre I, 2025

---

**Estudiantes**

- Sebastián Calvo Hernández- 2022099320
- Franco Rojas Lagos - 2022437823

---

**Profesor**

-  Nereo Campos Araya

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
4. [Instalación y configuración](#instalación-y-configuración)
5. [Pruebas realizadas y pruebas unitarias](#pruebas-realizadas-y-pruebas-unitarias)
6. [Recomendaciones](#recomendaciones)
7. [Conclusiones](#conclusiones)
8. [Referencias](#referencias-bibliográficas)

---

## Introducción

**bioXiv-Search-V2**, es un proyecto cuyo objetivo es implementar un motor de búsqueda de artículos científicos de Covid-19 utilizando la base de datos NoSQL llamada Mongo Atlas Search, para este propósito utilizaremos un repositorio de descripciones de artículos científicos llamada bioRxiv, específicamente su API.

---

## Estructura del Proyecto

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

---

## Despliegue

### Requisitos

- Docker Desktop / Minikube
- Helm
- Kubernetes
- Git
- Node.js
- Vercel
- RabbitMQ
- React
- npm
- Cuenta de MongoDB Atlas
- Proyecto de Firebase
- Cloud Firestore

---

## Instalación y configuración

### 1. Clonar el repositorio

Primero, clona el repositorio del proyecto en tu máquina local:

```bash
git clone https://github.com/<tu-usuario>/bioRxiv-Search-V2.git
cd bioRxiv-Search-V2
```
### 2. Configuración de MongoDB Atlas

1. Crea una cuenta en MongoDB Atlas.
2. Configura un clúster y habilita MongoDB Atlas Search.
3. Crea una base de datos llamada biorxiv y una colección llamada documents.
4. Configura los índices necesarios para las búsquedas (por ejemplo, índices en los campos title, abstract, y entities.text).

![Mongo Atlas](MongoAtlas.png)

### 3. Configuración de Firebase

1. Crea un proyecto en Firebase.
2. Habilita Firestore Database.
3. Descarga el archivo de configuración firebase-adminsdk.json y colócalo en api/libs/firebaseAdmin.js.

![Cloud Firestore](CloudFirestore.png)

### 4. Construcción de imágenes Docker

Para construir las imágenes Docker de los diferentes componentes, utiliza el siguiente comando:

```bash
docker build -t <nombre-del-componente>:latest .
```

Ejemplo para construir el componente controller:

```bash
docker build -t controller:latest ./controller
```

Repite este proceso para los demás componentes (crawler, spacy_processor, spark_job, etc.).

### 5. Despliegue con Helm

Para desplegar los Helm charts en tu clúster de Kubernetes, utiliza el siguiente comando:

```bash
helm upgrade --install biorxiv-search-v2 . --namespace default
```

Este comando instalará todos los recursos definidos en los Helm charts, incluyendo MongoDB, RabbitMQ, y los microservicios del proyecto.

![RabbitMQ](RabbitMQ.png)

### 6. Configuración de la UI

Navega a la carpeta ui/:

```bash
cd ui
```

Instala las dependencias:

```bash
npm install
```

Inicia la aplicación en modo desarrollo:

```bash
npm start
```

Para desplegar la UI en producción, utiliza Vercel o cualquier servicio de hosting compatible.

![Vercel](Vercel.png)

---

## Pruebas realizadas y pruebas unitarias

### 1. Conexión a MongoDB Atlas

Para verificar la conexión con la base de datos MongoDB Atlas y explorar la colección documents, se utilizó el siguiente comando:

```bash
docker run --rm -it mongo:6.0 mongosh \
  "mongodb+srv://sebcalvo:9StJIotFXpl0CbNw@cluster0.xosgnib.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
```

Este comando permitió conectarse al clúster de MongoDB Atlas y realizar consultas directas para validar la estructura y los datos almacenados.

### 2. Inserción de datos en MongoDB

Para insertar nuevos documentos en las colecciones raw y augmented dentro de MongoDB, se utilizó el siguiente comando:

```bash
kubectl run -i --rm mongo-client \
  --image=mongo:6.0 --restart=Never \
  --namespace default -- bash \
  -c 'mongosh "mongodb://root:rootPass123@biorxiv-search-v2-mongodb.default.svc.cluster.local:27017/projectDB?authSource=admin" --eval "db.jobs.insertOne({ total: 60, pageSize: 15 });"'
```

Este comando permitió validar la capacidad de inserción de datos en las colecciones y verificar que los índices configurados funcionen correctamente.

### 3. Creación de un Job derivado de un CronJob

Para probar la ejecución de un Job derivado del CronJob spark-processor-cron, se utilizó el siguiente comando:

```bash
kubectl create job --from=cronjob/spark-processor-cron prueba-spark-job -n default
```

Este comando permitió ejecutar un Job manualmente y validar el procesamiento de datos en Spark.

### 4. Visualización de logs de los componentes

Para inspeccionar los logs de cada componente y verificar su funcionamiento, se utilizó el siguiente comando:

```bash
kubectl logs <nombre-del-pod> -n default --follow
```

Ejemplo para el componente controller:

```bash
kubectl logs controller-8ddbd5c7-9krlg -n default --follow
```

Este comando permitió identificar errores, analizar el flujo de datos y validar la ejecución de los microservicios.

### 5. Pruebas unitarias

- **Prueba de Controller:**
```bash
kubectl logs controller-8ddbd5c7-9krlg -n default --follow
```

En los logs se puede ver lo siguiente:

![Prueba Controller](PruebaController.png)

- **Prueba de Crawler:**
```bash
kubectl logs crawler-6c679877b-2dzz5 -n default --follow
```

En los logs se puede ver lo siguiente:

![Prueba Crawler](PruebaCrawler.png)

- **Prueba de Spacy:**
```bash
kubectl logs spacy-processor-5bfc4ccb7c-jjzv4 -n default --follow
```

En los logs se puede ver lo siguiente:

![Prueba Spacy](PruebaSpacy.png)

- **Prueba de Spark Job:**
```bash
kubectl logs spark-processor-cron-29154540-dvf9m -n default --follow
```

En los logs se puede ver lo siguiente, primero como se procesan los datos:

![Prueba Spark](PruebaSpark1.png)

luego como se mueven a otra carpeta para no ingresar repetidos a Mongo Atlas:

![Prueba Spark](PruebaSpark2.png)

---

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

---

## Conclusiones

- El diseño modular basado en microservicios facilitó el desarrollo paralelo y la escalabilidad independiente de cada componente.
- La adopción de MongoDB Atlas Search mejoró significativamente la relevancia y velocidad de las búsquedas faceted.
- La extracción de entidades con SpaCy enriqueció los metadatos, permitiendo búsquedas más semánticas.
- Spark permitió procesar y normalizar grandes volúmenes de datos de manera eficiente con CronJobs.
- La UI React/Vite/Tailwind ofreció una experiencia de usuario fluida y adaptable a dispositivos móviles.
- Las recomendaciones futuras apuntan a mejorar la observabilidad, la seguridad y la automatización total del ciclo de vida.
- La integración de RabbitMQ permitió una comunicación eficiente entre los microservicios, asegurando la entrega de mensajes y la tolerancia a fallos en procesos críticos.
- La implementación de Kubernetes y Helm facilitó la orquestación y el despliegue automatizado de los microservicios, mejorando la gestión de recursos y la escalabilidad del sistema.
- La utilización de Docker garantizó la portabilidad y consistencia de los entornos de desarrollo, prueba y producción, reduciendo problemas de configuración.
- La arquitectura basada en eventos y procesamiento distribuido permitió manejar grandes volúmenes de datos de manera eficiente, optimizando el rendimiento del sistema bajo alta concurrencia.

---

## Referencias bibliográficas

- [Kubernetes](https://kubernetes.io/docs/)
- [Helm](https://helm.sh/docs/)