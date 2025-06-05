FROM bitnami/spark:3.2.1

# 1) Creamos el directorio absoluto para el cache de Ivy y ajustamos permisos
USER root
RUN apt-get update && apt-get install -y wget && \
    mkdir -p /opt/ivy-cache /root/.ivy2 && \
    chown -R 1001:1001 /opt/ivy-cache /root/.ivy2

# Agregamos una entrada en /etc/passwd para UID 1001
RUN echo "sparkuser:x:1001:1001:Spark User:/home/sparkuser:/bin/bash" >> /etc/passwd

# Creamos el directorio de jars y descargamos las dependencias:
RUN mkdir -p /opt/spark/jars && \
    wget -O /opt/spark/jars/mongo-spark-connector_2.12-3.0.1.jar \
         https://repo1.maven.org/maven2/org/mongodb/spark/mongo-spark-connector_2.12/3.0.1/mongo-spark-connector_2.12-3.0.1.jar && \
    wget -O /opt/spark/jars/mongodb-driver-core-4.0.5.jar \
         https://repo1.maven.org/maven2/org/mongodb/mongodb-driver-core/4.0.5/mongodb-driver-core-4.0.5.jar && \
    wget -O /opt/spark/jars/bson-4.0.5.jar \
         https://repo1.maven.org/maven2/org/mongodb/bson/4.0.5/bson-4.0.5.jar && \
    wget -O /opt/spark/jars/mongodb-driver-sync-4.0.5.jar \
         https://repo1.maven.org/maven2/org/mongodb/mongodb-driver-sync/4.0.5/mongodb-driver-sync-4.0.5.jar && \
    chown 1001:1001 /opt/spark/jars/*

USER 1001
WORKDIR /app

# 2) Copiamos el script PySpark dentro de /app
COPY --chown=1001:1001 job.py /app/job.py

# 3) Definimos el ENTRYPOINT pasando todos los jars.
ENTRYPOINT ["spark-submit", \
            "--master", "local[*]", \
            "--jars", "/opt/spark/jars/mongo-spark-connector_2.12-3.0.1.jar,/opt/spark/jars/mongodb-driver-core-4.0.5.jar,/opt/spark/jars/bson-4.0.5.jar,/opt/spark/jars/mongodb-driver-sync-4.0.5.jar", \
            "--conf", "spark.jars.ivy=/opt/ivy-cache", \
            "--conf", "spark.hadoop.fs.defaultFS=file:///", \
            "--conf", "spark.hadoop.hadoop.security.authentication=simple", \
            "job.py"]