from fastapi import FastAPI, File, UploadFile, Form, BackgroundTasks
from fastapi.responses import FileResponse
import descriptores as ds
import numpy as np
import json
import aviamat
import clustering.kmeans as kmeans
import clustering.minibatchKmeans as mkm
import clustering.gmm as gmm
import clustering.agglomerative as agglo
import clustering.spectralClustering as spec
import clustering.sustractivo as sustractivo
import clustering.hdb as hdb
import redneuronal.entrenamiento as train
import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
from tensorflow import keras
from tensorflow import metrics

app = FastAPI()

rutinas_ia = {
    "Kmeans" : kmeans.km,
    "MiniBatch Kmeans" : mkm.mbkm,
    "GMM" : gmm.gmm,
    "Spectral Clustering" : spec.sc,
    "Agglometarive Clustering" : agglo.agglo,
    "Hdbscan" : hdb.hello,
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
    "Filtro Bajo": ds.filtroBajo,
    "Filtro Medio": ds.filtroMedio,
    "Filtro Alto": ds.filtroAlto,
    "Adri": ds.adri,
}

@app.post("/calculoDescriptores")
async def calcularDescriptores(file: UploadFile = File(...), jsonData: str = Form(...)):
    videoAvi = await file.read()
    print(f"Archivo recibido: {file.filename}, tamaño: {len(videoAvi)} bytes")
    tensor = np.array(aviamat.videoamat(videoAvi)).transpose(1,2,0)
    parsed_data = json.loads(jsonData)

    print(f"JSON recibido: {parsed_data}")
    
    respuesta = []
    for datos in  parsed_data:
        print(f"Los datos son: {datos}")
        parametros = []
        rutina = rutinas_descriptores.get(datos['name'])
        print(f"Nombre del descriptor: {datos['name']}")
        for parametro in datos['params']:
            parametros.append(parametro['value'])    
        matriz = rutina(tensor,*parametros).tolist()
        res = {
            "nombre" : datos['name'],
            "matriz" : matriz,
        }
        respuesta.append(res)
    return respuesta

@app.post("/clustering")
async def calcularClustering(jsonFile1: UploadFile = File(), jsonFile2: UploadFile = File()):

    descriptores_json = await jsonFile1.read()
    descriptores = json.loads(descriptores_json)

    clustering_json = await jsonFile2.read()
    clus = json.loads(clustering_json)

    
    desc = descriptores['descriptores']
    total = len(desc)
    print(f"Nro de matrices de descriptores recibidas: {total}")
    print(f"Nro de clustering a procesar: {len(clus)}")

    tensor = np.zeros((len (desc[0]),len (desc[1]),total))

    for t, datos in enumerate(desc):
        tensor[:, :, t] = np.array(datos)
    
    respuesta = []
    for datos in clus:
        rutina = rutinas_ia.get(datos['name'])
        print(rutina)
        clusters = int(datos['Nro_clusters'])
        matriz = rutina(tensor,clusters).tolist()
        res = {
            "nombre" : datos['name'],
            "matriz" : matriz,
        }
        respuesta.append(res)

    return respuesta

@app.post("/entrenamientoRed")
async def neuronal(background_tasks: BackgroundTasks,jsonFile1: UploadFile = File(), jsonFile2: UploadFile = File()):
    
    descriptores_json = await jsonFile1.read()
    descriptores = json.loads(descriptores_json)

    params_json = await jsonFile2.read()
    params = json.loads(params_json)

    
    desc = descriptores['descriptores']
    total = len(desc)-1
    print(f"Nro de matrices de descriptores recibidas: {total}")
    print(f"Nro de capas: {len(params)}")

    tensor = np.zeros((len (desc[0]),len (desc[1]),total))


    for t, datos in enumerate(desc[:-1]):
        tensor[:, :, t] = np.array(datos)
    
    entrada = tensor.reshape(-1,total)

    print (entrada.shape)
    
    resultados = np.array(desc[-1])

    resultados = resultados.reshape(-1)

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
async def calcularDescriptores(file: UploadFile = File(...), jsonFile: UploadFile = File()):
    model_path = "modelo_temporal.h5"
    with open(model_path, "wb") as f:
        f.write(await file.read())

    modelo = await file.read()
    print(f"Archivo recibido: {file.filename}, tamaño: {len(modelo)} bytes")
    
    
    modelo = keras.models.load_model(modelo, custom_objects={'mse': metrics.MeanSquaredError()})
    
    print(f"Modelo cargado desde {file.filename}")
  
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

    #background_tasks.add_task(eliminar_archivo, file.filename)
    
    respuesta = {
        "prediccion": resultado.tolist(),
    }
    
    return respuesta