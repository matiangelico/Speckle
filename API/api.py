# python -m uvicorn api:app --reload --ssl-keyfile key.pem --ssl-certfile cert.pem
# python -m uvicorn api:app --ssl-keyfile key.pem --ssl-certfile cert.pem --workers 4

import base64
import io
import zipfile
import uvicorn
from dotenv import load_dotenv
from tensorflow import metrics
from tensorflow import keras
from fastapi import FastAPI, File, UploadFile, Form, BackgroundTasks, Header, HTTPException
from fastapi.responses import StreamingResponse
import descriptores as ds
import numpy as np
from normalizar import normalizar
import json
import aviamat
from generadorImagenes import generaImagenCluster,generaImagenDescriptor,generaImagenPrediccion
from clustering import kmeans, minibatchKmeans, sustractivo, bisectingKMeans, gaussianMixture
import entrenamiento as train
import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

app = FastAPI()

load_dotenv()
API_KEY = os.getenv("API_KEY")

rutinas_clustering = {
    "kmeans": kmeans.km,
    "miniBatchKmeans": minibatchKmeans.mbkm,
    "bisectingKmeans": bisectingKMeans.bKm,
    "gaussianMixture": gaussianMixture.gm,
    "subtractiveClustering": sustractivo.sub,
}

rutinas_descriptores = {
    "dr": ds.rangoDinamico,
    "wgd": ds.diferenciasPesadas,
    "sa": ds.diferenciasPromediadas,
    "ad": ds.fujii,
    "sd": ds.desviacionEstandar,
    "tc": ds.contrasteTemporal,
    "ac": ds.autoCorrelacion,
    "fg": ds.fuzzy,
    "mf": ds.frecuenciaMedia,
    "swe": ds.entropiaShannon,
    "cf": ds.frecuenciaCorte,
    "we": ds.waveletEntropy,
    "hlr": ds.highLowRatio,
    "lfeb": ds.filtro,
    "mfeb": ds.filtro,
    "hfeb": ds.filtro,
    "scc": ds.adri,
}


async def validaApiKey(x_api_key):
    if (x_api_key != API_KEY):
        raise HTTPException(status_code=403, detail="Invalid API Key")


@app.post("/descriptores")
async def descriptores(x_api_key: str = Header(None), video_experiencia: UploadFile = File(...), datos_descriptores: str = Form(...)):
    await validaApiKey(x_api_key)
    videoAvi = await video_experiencia.read()
    print(f"Archivo recibido: {video_experiencia.filename}, tamaño: {len(videoAvi)} bytes")
    tensor = np.array(aviamat.videoamat(videoAvi)).transpose(1, 2, 0).astype(np.uint8)
    print (f"Dimensiones: {tensor.shape}")
    desc_params = json.loads(datos_descriptores)

    respuesta_imagenes = []
    respuesta_matrices = []
    respuesta_matrices_normalizada = []
    for datos in desc_params:
        id = datos['id']
        rutina = rutinas_descriptores.get(id)
        print(f"Nombre del descriptor: {id}")
        params = datos['params']
        parametros = []
        if (id == 'lfeb' or id == 'mfeb' or id == 'hfeb'):
            parametros.append(
                next((param['value'] for param in params if param['paramId'] == 'fmin'), None))
            parametros.append(
                next((param['value'] for param in params if param['paramId'] == 'fmax'), None))
            parametros.append(
                next((param['value'] for param in params if param['paramId'] == 'atPaso'), None))
            parametros.append(next(
                (param['value'] for param in params if param['paramId'] == 'atRechazo'), None))
        elif (id == 'wgd'):
            parametros.append(
                next((param['value'] for param in params if param['paramId'] == 'weight'), None))
        elif (id == 'we'):
            parametros.append(next(
                (param['value'] for param in params if param['paramId'] == 'wavelet'), None))
            parametros.append(
                next((param['value'] for param in params if param['paramId'] == 'level'), None))

        matriz = rutina(tensor, *parametros)
        matrices = {"id_descriptor": id, "matriz_descriptor": matriz.tolist()}
        matriz = normalizar(matriz)
        imagenes = {"id_descriptor": id,"imagen_descriptor": generaImagenDescriptor.colorMap(matriz)}
        matrices_normalizadas = {"id_descriptor": id, "matriz_descriptor": matriz.reshape(-1).tolist()}
        respuesta_imagenes.append(imagenes)
        respuesta_matrices.append(matrices)
        respuesta_matrices_normalizada.append(matrices_normalizadas)

    return {"matrices_descriptores": respuesta_matrices, "imagenes_descriptores": respuesta_imagenes,"matrices_descriptores_normalizada": respuesta_matrices_normalizada}


@app.post("/clustering")
async def clustering(x_api_key: str = Header(None), matrices_descriptores: UploadFile = File(), datos_clustering: str = Form(...),video_dimensiones: str = Form(...)):
    await validaApiKey(x_api_key)
    desc_json = await matrices_descriptores.read()
    matrices_desc = json.loads(desc_json)

    clust_params = json.loads(datos_clustering)

    dimensiones = json.loads(video_dimensiones)
    ancho = int(dimensiones['width'])
    alto = int(dimensiones['height'])

    total = len(matrices_desc)
    print(f"Nro de matrices de descriptores recibidas: {total}")
    print(f"Cantidad de clustering a procesar: {len(clust_params)}")

    #tensor = np.zeros((len(matrices_desc[0]['matriz_descriptor']), len(matrices_desc[0]['matriz_descriptor'][0]), total))
    tensor = np.zeros((alto,ancho,total))
    print(tensor.shape)
    
    for t, datos in enumerate(matrices_desc):
        tensor[:, :, t] = np.array(datos['matriz_descriptor']).reshape(alto,ancho)

    respuesta_imagenes = []
    respuesta_matrices = []
    
    for datos in clust_params:
        id = datos['id']
        rutina = rutinas_clustering.get(id)
        params = datos['params']
        parametros = []
        if (id == 'kmeans' or id == 'miniBatchKmeans' or id == 'bisectingKmeans'):
            parametros.append(next(
                (param['value'] for param in params if param['paramId'] == 'nroClusters'), None))
        elif (id == 'gaussianMixture'):
            parametros.append(next(
                (param['value'] for param in params if param['paramId'] == 'nroComponents'), None))
        else:
            parametros.append(
                next((param['value'] for param in params if param['paramId'] == 'ra'), None))
            parametros.append(
                next((param['value'] for param in params if param['paramId'] == 'rb'), None))
            parametros.append(
                next((param['value'] for param in params if param['paramId'] == 'eUp'), None))
            parametros.append(
                next((param['value'] for param in params if param['paramId'] == 'eDown'), None))
        print(id, *parametros)
        
        respuesta = rutina(tensor, *parametros)
        
        if respuesta is not None:
            m, clusters = respuesta
            imagenes = {"id_clustering": id, "imagen_clustering": generaImagenCluster.colorMap(m), "nro_clusters": clusters}
            matrices = {"id_clustering": id,"matriz_clustering": m.reshape(-1).tolist(), "nro_clusters": clusters}
            respuesta_imagenes.append(imagenes)
            respuesta_matrices.append(matrices)
        
    return {"matrices_clustering": respuesta_matrices, "imagenes_clustering": respuesta_imagenes}


@app.post("/entrenamiento")
async def neuronal(background_tasks: BackgroundTasks, x_api_key: str = Header(None), matrices_descriptores: UploadFile = File(), matriz_clustering: UploadFile = File(), parametros_entrenamiento: str = Form(...)):
    await validaApiKey(x_api_key)
    desc_json = await matrices_descriptores.read()
    matrices_desc = json.loads(desc_json)

    clus_json = await matriz_clustering.read()
    matriz_clus = json.loads(clus_json)

    train_params = json.loads(parametros_entrenamiento)

    total = len(matrices_desc)

    print(f"Nro de matrices de descriptores recibidas: {total}")
    print(f"Clustering seleccionado: {matriz_clus['id_clustering']}")

    tensor = np.zeros((len(matrices_desc[0]['matriz_descriptor']), len(
        matrices_desc[0]['matriz_descriptor'][0]), total))

    for t, datos in enumerate(matrices_desc):
        tensor[:, :, t] = np.array(datos['matriz_descriptor'])

    entrada = tensor.reshape(-1, total)
    resultados = np.array(matriz_clus['matriz_clustering']).reshape(-1)
    nro_clusters = matriz_clus['nro_clusters']

    print(entrada.shape)
    print(resultados.shape)

    layers = train_params['neuralNetworkLayers']

    parametros_entrenamiento = np.zeros((len(layers), 3))

    for t, datos in enumerate(layers):
        parametros_entrenamiento[t, 0] = float(datos['neurons'])
        parametros_entrenamiento[t, 1] = int(datos['batchNorm'])
        parametros_entrenamiento[t, 2] = float(datos['dropout'])

    params = train_params['neuralNetworkParams']
    epocas = int(params['epocs'])
    b_size = int(params['batchsize'])
    estop = int(params['earlystopping'].lower() == 'true')

    print(parametros_entrenamiento)

    model, conf_matrix = train.entrenamientoRed(
        entrada, resultados, nro_clusters, parametros_entrenamiento, epocas, b_size, estop)

    model_path = "modelo_entrenado.keras"
    model.save(model_path)

    imagen_json = {"matriz_confusion": base64.b64encode(
        conf_matrix.getvalue()).decode('utf-8')}
    imagen_json_str = json.dumps(imagen_json)

    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
        zip_file.write(model_path, arcname="modelo_entrenado.keras")
        zip_file.writestr("matriz_confusion.json",
                          imagen_json_str.encode('utf-8'))

    zip_buffer.seek(0)

    background_tasks.add_task(eliminar_archivo, model_path)

    return StreamingResponse(zip_buffer, media_type="application/zip", headers={"Content-Disposition": "attachment; filename=archivos.zip"})

@app.post("/entrenamientoRed")
async def neuronal2(background_tasks: BackgroundTasks, x_api_key: str = Header(None), matrices_descriptores: UploadFile = File(), parametros_entrenamiento: str = Form(...)):
    await validaApiKey(x_api_key)
    desc_json = await matrices_descriptores.read()
    matrices = json.loads(desc_json)

    train_params = json.loads(parametros_entrenamiento)

    total = len(matrices)

    print(f"Nro de matrices de descriptores recibidas: {total-1}")
    print(f"Clustering seleccionado: {matrices[total-1]['id_clustering']}")

    matriz_caracteristicas = np.zeros((len(matrices[0]['matriz_descriptor']), total))

    for t, datos in enumerate(matrices[:-1]):
        matriz_caracteristicas[:, t] = np.array(datos['matriz_descriptor'])
    matriz_caracteristicas[:,total-1] = np.array(matrices[total-1]['matriz_clustering'])

    nro_clusters = (np.unique(np.array(matrices[total-1]['matriz_clustering']))).size
    print ('nro de cluster ',nro_clusters)
    print(matriz_caracteristicas.shape)

    layers = train_params['neuralNetworkLayers']

    parametros_entrenamiento = np.zeros((len(layers), 3))

    for t, datos in enumerate(layers):
        parametros_entrenamiento[t, 0] = float(datos['neurons'])
        parametros_entrenamiento[t, 1] = int(datos['batchNorm'])
        parametros_entrenamiento[t, 2] = float(datos['dropout'])

    params = train_params['neuralNetworkParams']
    epocas = int(params['epocs'])
    b_size = int(params['batchsize'])
    estop = int(params['earlystopping'].lower() == 'true')

    print(parametros_entrenamiento)

    model, conf_matrix = train.entrenamientoRed(matriz_caracteristicas, nro_clusters, parametros_entrenamiento, epocas, b_size, estop)

    model_path = "modelo_entrenado.keras"
    model.save(model_path)

    imagen_json = {"matriz_confusion": base64.b64encode(
        conf_matrix.getvalue()).decode('utf-8')}
    imagen_json_str = json.dumps(imagen_json)

    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
        zip_file.write(model_path, arcname="modelo_entrenado.keras")
        zip_file.writestr("matriz_confusion.json",
                          imagen_json_str.encode('utf-8'))

    zip_buffer.seek(0)

    background_tasks.add_task(eliminar_archivo, model_path)

    return StreamingResponse(zip_buffer, media_type="application/zip", headers={"Content-Disposition": "attachment; filename=archivos.zip"})

async def eliminar_archivo(path: str):
    if os.path.exists(path):
        os.remove(path)

@app.post("/prediccion")
async def prediccion(background_tasks: BackgroundTasks, x_api_key: str = Header(None), modelo_entrenado: UploadFile = File(...), matrices_descriptores: UploadFile = File()):
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

    tensor = np.zeros((alto, ancho, total))

    for t, datos in enumerate(matrices_desc):
        tensor[:, :, t] = np.array(datos['matriz_descriptor'])

    entrada = tensor.reshape(-1, total)

    print(entrada.shape)

    resultado = modelo.predict(entrada).astype(np.float32)

    resultado_matriz = np.argmax(resultado, axis=-1)

    resultado_matriz = resultado_matriz.reshape(alto, ancho)

    background_tasks.add_task(eliminar_archivo, model_path)

    respuesta_matriz = {"matriz": resultado_matriz.tolist()}
    respuesta_tensor = {"tensor": resultado.tolist()}
    respuesta_imagen = {"imagen": generaImagenPrediccion.colorMap(resultado_matriz.tolist())}

    return {"matriz_prediccion": respuesta_matriz, "imagen_prediccion": respuesta_imagen, "tensor_prediccion": respuesta_tensor}


@app.post("/prediccionRed")
async def prediccion(background_tasks: BackgroundTasks, x_api_key: str = Header(None), modelo_entrenado: UploadFile = File(...), matrices_descriptores: UploadFile = File(),video_dimensiones: str = Form(...)):
    await validaApiKey(x_api_key)
    model_path = "modelo_temporal.keras"
    
    dimensiones = json.loads(video_dimensiones)
    ancho = int(dimensiones['width'])
    alto = int(dimensiones['height'])
    
    with open(model_path, "wb") as f:
        f.write(await modelo_entrenado.read())

    modelo = keras.models.load_model(model_path, custom_objects={'mse': metrics.MeanSquaredError()})

    desc_json = await matrices_descriptores.read()
    matrices_desc = json.loads(desc_json)

    total = len(matrices_desc)
    print(f"Nro de matrices de descriptores recibidas: {total}")

    matriz = np.zeros((len(matrices_desc[0]['matriz_descriptor']), total))

    for t, datos in enumerate(matrices_desc):
        matriz[:, t] = np.array(datos['matriz_descriptor'])

    print(matriz.shape)

    resultado = modelo.predict(matriz).astype(np.float32)

    resultado_matriz = np.argmax(resultado, axis=-1)

    resultado_matriz = resultado_matriz.reshape(alto,ancho)

    background_tasks.add_task(eliminar_archivo, model_path)

    respuesta_matriz = {"matriz": resultado_matriz.tolist()}
    respuesta_tensor = {"tensor": resultado.tolist()}
    respuesta_imagen = {"imagen": generaImagenPrediccion.colorMap(resultado_matriz.tolist())}

    return {"matriz_prediccion": respuesta_matriz, "imagen_prediccion": respuesta_imagen, "tensor_prediccion": respuesta_tensor}


@app.get("/health")
async def health_check( x_api_key: str = Header(None)):
    await validaApiKey(x_api_key)
    return {"status": "ok"}


if __name__ == "__main__":
    uvicorn.run(
        "api:app",
        host=os.getenv("host"),
        port=os.getenv("port"),
        ssl_keyfile=os.getenv("ssl_keyfile"),
        ssl_certfile=os.getenv("ssl_certfile"),
    )
