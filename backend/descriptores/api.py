from fastapi import FastAPI, File, UploadFile, Form, BackgroundTasks
from fastapi.responses import FileResponse, StreamingResponse
import descriptores as ds
import numpy as np
import json
import aviamat
import generaImagen as gi
import clustering.kmeans as kmeans
import clustering.minibatchKmeans as mkm
import clustering.gmm as gmm
import clustering.spectralClustering as spec
import clustering.sustractivo as sustractivo
import clustering.hdb as hdb
import redneuronal.entrenamiento as train
import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
from tensorflow import keras
from tensorflow import metrics
import normalizar 

app = FastAPI()

rutinas_clustering = {
    "Kmeans" : kmeans.km,
    "MiniBatch Kmeans" : mkm.mbkm,
    "GMM" : gmm.gmm,
    "Spectral Clustering" : spec.sc,
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

@app.post("/descriptores")
async def descriptores(file: UploadFile = File(...), jsonData: str = Form(...)):
    videoAvi = await file.read()
    print(f"Archivo recibido: {file.filename}, tamaño: {len(videoAvi)} bytes")
    tensor = np.array(aviamat.videoamat(videoAvi)).transpose(1,2,0).astype(np.uint8)
    desc_params = json.loads(jsonData)

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
async def clustering(jsonFile: UploadFile = File(), jsonData: str = Form(...)):

    desc_json = await jsonFile.read()
    matrices_desc = json.loads(desc_json)

    clust_params = json.loads(jsonData)

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
        param = int(datos['radius']) if (datos['name']=="Sustractive Clustering")else int(datos['nro_clusters'])
        print(f"Nombre del Clustering: {datos['name']}. Parametro {param}")
        matriz = rutina(tensor,param).tolist()
        imagenes = {"nombre_clustering" : datos['name'],"imagen_clustering" : gi.colorMap(matriz)}
        matrices = {"nombre_clustering" : datos['name'],"matriz_clustering" : matriz}
        respuesta_imagenes.append(imagenes)
        respuesta_matrices.append(matrices)

    return {"matrices_clustering":respuesta_matrices,"imagenes_clustering":respuesta_imagenes}


@app.post("/entrenamientoRed")
async def neuronal(background_tasks: BackgroundTasks,jsonFile1: UploadFile = File(), jsonFile2: UploadFile = File()):
    
    matrices_json = await jsonFile1.read()
    matrices = json.loads(matrices_json)

    params_json = await jsonFile2.read()
    params = json.loads(params_json)

    
    desc = matrices['descriptores']
    resultados = np.array(matrices['clustering']).reshape(-1)
    total = len(desc)
    print(f"Nro de matrices de descriptores recibidas: {total}")
    print(f"Nro de capas: {len(params)}")

    tensor = np.zeros((len (desc[0]),len (desc[1]),total))


    for t, datos in enumerate(desc):
        tensor[:, :, t] = np.array(datos)
    
    entrada = tensor.reshape(-1,total)

    print (entrada.shape)
    print (resultados.shape)

    parametros_entrenamiento = np.zeros((3,len(params)))

    for t,datos in enumerate(params):      
        parametros_entrenamiento[t,0]=float(datos['Neuronas'])
        parametros_entrenamiento[t,1]=int(datos['BatchNormalization'])
        parametros_entrenamiento[t,2]=float(datos['Dropout'])
    
    print(parametros_entrenamiento)
    
    model = train.entrenamientoRed(entrada,resultados,parametros_entrenamiento)

    model_path = "modelo_entrenado.h5"
    model.save(model_path)

    respuesta = FileResponse(model_path, filename="modelo_entrenado.h5", media_type='application/octet-stream')

    background_tasks.add_task(eliminar_archivo, model_path)
    
    return respuesta


def eliminar_archivo(model_path: str):
    os.remove(model_path)


@app.post("/prediccionRed")
async def prediccion(background_tasks: BackgroundTasks,file: UploadFile = File(...), jsonFile: UploadFile = File()):
    
    model_path = "modelo_temporal.h5"
    with open(model_path, "wb") as f:
        f.write(await file.read())

    #modelo = await file.read()
    #print(f"Archivo recibido: {file.filename}, tamaño: {len(modelo)} bytes")
    
    
    modelo = keras.models.load_model(model_path, custom_objects={'mse': metrics.MeanSquaredError()})
    
  
    descriptores_json = await jsonFile.read()
    descriptores = json.loads(descriptores_json)
    
    desc = descriptores['descriptores']
    total = len(desc)
    print(f"Nro de matrices de descriptores recibidas: {total}")

    tensor = np.zeros((len (desc[0]),len (desc[1]),total))


    for t, datos in enumerate(desc):
        tensor[:, :, t] = np.array(datos)
    
    entrada = tensor.reshape(-1,total)

    print (entrada.shape)
   
    resultado = modelo.predict(entrada)

    resultado = normalizar.n(resultado.reshape(300,300))

    background_tasks.add_task(eliminar_archivo, model_path)
    
    respuesta = {
        "prediccion": resultado.tolist(),
    }

    return respuesta