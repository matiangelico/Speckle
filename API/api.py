#python -m uvicorn api:app --reload --ssl-keyfile key.pem --ssl-certfile cert.pem

from fastapi import FastAPI, File, UploadFile, Form, BackgroundTasks, Header, HTTPException
from fastapi.responses import FileResponse
import descriptores as ds
import numpy as np
import json
import aviamat
import generaImagen as gi
from clustering import kmeans,minibatchKmeans,gauss,spectralClustering,sustractivo
import redneuronal.entrenamiento as train
import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
from tensorflow import keras
from tensorflow import metrics
from normalizar import normalizar
from dotenv import load_dotenv
import uvicorn

app = FastAPI() 

load_dotenv()
API_KEY = os.getenv("API_KEY")

rutinas_clustering = {
    "Kmeans" : kmeans.km,
    "MiniBatch Kmeans" : minibatchKmeans.mbkm,
    "Promedio Gaussiano" : gauss.bc,
    "Spectral Clustering" : spectralClustering.sc,
    "Sustractive Clustering": sustractivo.sus,
}

rutinas_descriptores = {
    "Rango Dinamico" : ds.rangoDinamico,
    "Diferencias Pesadas" : ds.diferenciasPesadas,
    "Diferencias Promediadas": ds.diferenciasPromediadas,
    "Fujii": ds.fujii,
    "Desviacion Estandar": ds.desviacionEstandar,
    "Contraste Temporal" : ds.contrasteTemporal,
    "Autocorrelacion": ds.autoCorrelacion,
    "Fuzzy": ds.fuzzy,
    "Frecuencia Media": ds.frecuenciaMedia,
    "Entropia Shannon": ds.entropiaShannon,
    "Frecuencia Corte": ds.frecuenciaCorte,
    "Wavelet Entropy": ds.waveletEntropy,
    "High Low Ratio": ds.highLowRatio,
    "Filtro Bajo": ds.filtro,
    "Filtro Medio": ds.filtro,
    "Filtro Alto": ds.filtro,
    "Adri": ds.adri,
}

async def validaApiKey(x_api_key):
    if (x_api_key != API_KEY):
        raise HTTPException(status_code=403, detail="Invalid API Key")

@app.post("/descriptores")
async def descriptores(x_api_key: str = Header(None),video_experiencia: UploadFile = File(...), datos_descriptores: str = Form(...)):
    
    await validaApiKey(x_api_key)
    videoAvi = await video_experiencia.read()
    print(f"Archivo recibido: {video_experiencia.filename}, tamaño: {len(videoAvi)} bytes")
    tensor = np.array(aviamat.videoamat(videoAvi)).transpose(1,2,0).astype(np.uint8)
    desc_params = json.loads(datos_descriptores)

    print(f"JSON recibido: {desc_params}")
    
    respuesta_imagenes = []
    respuesta_matrices =[]
    for datos in  desc_params:
        parametros = []
        rutina = rutinas_descriptores.get(datos['name'])
        print(f"Nombre del descriptor: {datos['name']}")
        for parametro in datos['params']:
            parametros.append(parametro['value'])    

        matriz = rutina(tensor,*parametros).tolist()
        imagenes = {"nombre_descriptor" : datos['name'],"imagen_descriptor" : gi.colorMap(matriz)}
        matrices = {"nombre_descriptor" : datos['name'],"matriz_descriptor" : matriz}
        respuesta_imagenes.append(imagenes)
        respuesta_matrices.append(matrices)
    return {"matrices_descriptores":respuesta_matrices,"imagenes_descriptores":respuesta_imagenes}


@app.post("/clustering")
async def clustering(x_api_key: str = Header(None),matrices_descriptores: UploadFile = File(), datos_clustering: str = Form(...)):
    await validaApiKey(x_api_key)
    desc_json = await matrices_descriptores.read()
    matrices_desc = json.loads(desc_json)

    clust_params = json.loads(datos_clustering)

    total = len(matrices_desc)
    
    print(f"Nro de matrices de descriptores recibidas: {total}")
    print(f"Cantidad de clustering a procesar: {len(clust_params)}")

    tensor = np.zeros((len(matrices_desc[0]['matriz_descriptor'][0]),len(matrices_desc[0]['matriz_descriptor'][1]),total))

    print(tensor.shape)
    
    for t, datos in enumerate(matrices_desc):
        tensor[:, :, t] = np.array(datos['matriz_descriptor'])

    respuesta_imagenes = []
    respuesta_matrices =[]

    for datos in clust_params:
        rutina = rutinas_clustering.get(datos['name'])
        parametros = datos['params'][0]
        param = int(parametros['value']) 
        print(f"Nombre del Clustering: {datos['name']}. Parametro {param}")
        matriz = rutina(tensor,param).tolist()
        imagenes = {"nombre_clustering" : datos['name'],"imagen_clustering" : gi.colorMap(matriz)}
        matrices = {"nombre_clustering" : datos['name'],"matriz_clustering" : matriz}
        respuesta_imagenes.append(imagenes)
        respuesta_matrices.append(matrices)

    return {"matrices_clustering":respuesta_matrices,"imagenes_clustering":respuesta_imagenes}


@app.post("/entrenamientoRed")
async def neuronal(background_tasks: BackgroundTasks,x_api_key: str = Header(None),matrices_descriptores: UploadFile = File(),matriz_clustering: UploadFile = File(), parametros_entrenamiento: str = Form(...)):
    await validaApiKey(x_api_key)
    desc_json = await matrices_descriptores.read()
    matrices_desc = json.loads(desc_json)

    clus_json = await matriz_clustering.read()
    matriz_clus = json.loads(clus_json)

    train_params = json.loads(parametros_entrenamiento)

    total = len(matrices_desc)

    print(f"Nro de matrices de descriptores recibidas: {total}")
    print(f"Clustering seleccionado: {matriz_clus['nombre_clustering']}")

    tensor = np.zeros((len(matrices_desc[0]['matriz_descriptor'][0]),len(matrices_desc[0]['matriz_descriptor'][1]),total))
    
    for t, datos in enumerate(matrices_desc):
        tensor[:, :, t] = np.array(datos['matriz_descriptor'])
    
    entrada = tensor.reshape(-1,total)
    resultados = np.array(matriz_clus['matriz_clustering']).reshape(-1)

    print (entrada.shape)
    print (resultados.shape)

    parametros_entrenamiento = np.zeros((len(train_params),3))

    for t,datos in enumerate(train_params):      
        parametros_entrenamiento[t,0]=float(datos['Neuronas'])
        parametros_entrenamiento[t,1]=int(datos['BatchNormalization'])
        parametros_entrenamiento[t,2]=float(datos['Dropout'])
    
    print(parametros_entrenamiento)
    
    model = train.entrenamientoRed(entrada,resultados,parametros_entrenamiento)

    model_path = "modelo_entrenado.keras"
    model.save(model_path)

    respuesta = FileResponse(model_path, filename="modelo_entrenado.keras", media_type='application/octet-stream')

    background_tasks.add_task(eliminar_archivo, model_path) 
    
    return respuesta


async def eliminar_archivo(model_path: str):
    os.remove(model_path)

@app.post("/prediccionRed")
async def prediccion(background_tasks: BackgroundTasks,x_api_key: str = Header(None),modelo_entrenado: UploadFile = File(...), matrices_descriptores: UploadFile = File()):
    
    await validaApiKey(x_api_key)
    model_path = "modelo_temporal.keras"
    with open(model_path, "wb") as f:
        f.write(await modelo_entrenado.read())

    modelo = keras.models.load_model(model_path, custom_objects={'mse': metrics.MeanSquaredError()})

    desc_json = await matrices_descriptores.read()
    matrices_desc = json.loads(desc_json)

    total = len(matrices_desc)
    print(f"Nro de matrices de descriptores recibidas: {total}")

    alto = len(matrices_desc[0]['matriz_descriptor'][0])
    ancho = len(matrices_desc[0]['matriz_descriptor'][1])

    tensor = np.zeros((alto,ancho,total))

    for t, datos in enumerate(matrices_desc):
        tensor[:, :, t] = np.array(datos['matriz_descriptor'])

    entrada = tensor.reshape(-1,total)

    print (entrada.shape)

    resultado = modelo.predict(entrada)

    resultado = normalizar(resultado.reshape(alto,ancho))

    background_tasks.add_task(eliminar_archivo, model_path)

    respuesta_matriz = {"prediccion": resultado.tolist()}
    respuesta_imagen = {"prediccion": gi.colorMap(resultado.tolist())}

    return {"matriz_prediccion":respuesta_matriz,"imagen_prediccion":respuesta_imagen}

if __name__ == "__main__":
    uvicorn.run(
        "api:app", 
        host=os.getenv("host"),
        port=os.getenv("port"), 
        ssl_keyfile=os.getenv("ssl_keyfile"), 
        ssl_certfile=os.getenv("ssl_certfile"),
    )
