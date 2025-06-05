from pyspark.sql import SparkSession
from pyspark.sql.functions import col, explode, to_date

spark = SparkSession.builder \
    .appName("BioRxivSparkProcessor") \
    .config("spark.mongodb.output.uri",
            "mongodb://root:rootPass123@biorxiv-search-v2-mongodb.default.svc.cluster.local:27017/projectDB.documents?authSource=admin") \
    .getOrCreate()

# 1) Leer todos los JSON enriquecidos que estén en /augmented
df_raw = spark.read.json("/augmented/*.json")

# 2) Explode del array "collection" para que cada artículo sea fila independiente
df_articles = df_raw.selectExpr("explode(collection) as article").select("article.*")

# 3) En este punto, verifica con df_articles.printSchema() que rel_authors sea array<struct<author_inst, author_name>>
#    Luego, extraemos solo el campo author_name de ese array:
#    - col("rel_authors.author_name") devuelve un array<string> (cada entry es el author_name de cada struct)
df_with_authors = df_articles.withColumn("authors", col("rel_authors.author_name"))

# 4) Normalizamos los demás campos (renombrar rel_title, rel_abs, rel_doi, etc.)
df_norm = df_with_authors \
    .withColumnRenamed("rel_doi", "doi") \
    .withColumnRenamed("rel_title", "title") \
    .withColumnRenamed("rel_abs", "abstract") \
    .withColumn("date", to_date(col("rel_date"), "yyyy-MM-dd")) \
    .withColumnRenamed("rel_category", "category")

# 5) Seleccionamos solo las columnas finales que queremos guardar en Mongo
df_out = df_norm.select(
    col("doi"),
    col("title"),
    col("abstract"),
    col("authors"),   # ahora es un array<string>
    col("date"),
    col("entities"),
    col("category")
)

# 6) Escribimos en MongoDB
df_out.write \
    .format("com.mongodb.spark.sql.DefaultSource") \
    .mode("append") \
    .option("database", "projectDB") \
    .option("collection", "documents") \
    .save()

spark.stop()
print("Spark Job completado con éxito.")