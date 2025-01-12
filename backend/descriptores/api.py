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
import clustering.agglomerative as agglo
import clustering.spectralClustering as spec
import clustering.sustractivo as sustractivo
import clustering.hdb as hdb
import redneuronal.entrenamiento as train
import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
from tensorflow import keras
from tensorflow import metrics
import normalizar
import io

app = FastAPI()

rutinas_clustering = {
    "Kmeans" : kmeans.km,
    "MiniBatch Kmeans" : mkm.mbkm,
    "GMM" : gmm.gmm,
    "Hdbscan" : hdb.h,
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

@app.post("/calculoTensor")
async def calcularDescriptores(file: UploadFile = File(...)):
    videoAvi = await file.read()
    print(f"Archivo recibido: {file.filename}, tamaño: {len(videoAvi)} bytes")
    tensor = np.array(aviamat.videoamat(videoAvi)).transpose(1,2,0).astype(np.uint8)
    buffer = io.BytesIO()
    np.savez_compressed(buffer, tensor=tensor)
    buffer.seek(0)

    return StreamingResponse(buffer, media_type="application/octet-stream", headers={
        "Content-Disposition": "attachment; filename=tensor_comprimido.npz"
    })


@app.post("/imagenesDescriptores")
async def calcularDescriptores(file: UploadFile = File(...), jsonData: str = Form(...)):
    archivo = await file.read()
    buffer = io.BytesIO(archivo)
    tensor = np.load(buffer)["tensor"]
    print(f"Archivo recibido: {file.filename}, tamaño: {len(tensor)} bytes")
    parsed_data = json.loads(jsonData)

    print(f"JSON recibido: {parsed_data}")
    
    respuesta = []
    for datos in  parsed_data:
        #print(f"Los datos son: {datos}")
        parametros = []
        rutina = rutinas_descriptores.get(datos['name'])
        print(f"Nombre del descriptor: {datos['name']}")
        for parametro in datos['params']:
            parametros.append(parametro['value'])    
        matriz = rutina(tensor,*parametros).tolist()
        res = {
            "nombre_descriptor" : datos['name'],
            "imagen_descriptor" : gi.colorMap(matriz),
        }
        respuesta.append(res)
    return respuesta

@app.post("/matrizDescriptor")
async def calcularDescriptores(file: UploadFile = File(...), jsonData: str = Form(...)):
    tensor_json = await file.read()
    print(f"Archivo recibido: {file.filename}, tamaño: {len(tensor_json)} bytes")
    tensor = np.array(tensor_json)
    descriptor = json.loads(jsonData)

    print(f"Descriptor recibido: {descriptor}")
    
    parametros = []
    rutina = rutinas_descriptores.get(descriptor['name'])
    for parametro in descriptor['params']:
        parametros.append(parametro['value'])    
    matriz = rutina(tensor,*parametros).tolist()
    res = {
        "nombre_descriptor" : descriptor['name'],
        "imagen_descriptor" : matriz,
    }
    
    return res


@app.post("/imagenesClustering")
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
        rutina = rutinas_clustering.get(datos['name'])
        print(f"Nombre del Clustering: {datos['name']}")
        if (datos['name']=="Sustractive Clustering"):
            param = int(datos['radius'])
        else:
            param = int(datos['nro_clusters'])
        print (param)
        matriz = rutina(tensor,param).tolist()
        res = {
            "nombre_clustering" : datos['name'],
            "matriz_clustering" : gi.colorMap(matriz),
        }
        respuesta.append(res)

    return respuesta

@app.post("/matrizClustering")
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
    
    rutina = rutinas_clustering.get(datos['name'])
    print(f"Nombre del Clustering: {datos['name']}")
    param = int(datos['radius']) if(datos['name']=="Sustractive Clustering") else int(datos['nro_clusters'])
    print (param)
    matriz = rutina(tensor,param).tolist()
    res = {
        "nombre_clustering" : datos['name'],
        "matriz_clustering" : matriz,
    }
    return res

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