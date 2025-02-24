#python -m uvicorn api:app --reload --ssl-keyfile key.pem --ssl-certfile cert.pem

from fastapi import FastAPI, File, UploadFile, Form, BackgroundTasks, Header, HTTPException
from fastapi.responses import JSONResponse, FileResponse
import descriptores as ds
import numpy as np
import json
import aviamat
import generaImagen as gi
from clustering import kmeans,minibatchKmeans,sustractivo,bisectingKMeans,hdbscan,spectralClustering
import redneuronal.entrenamiento as train
import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
from tensorflow import keras
from tensorflow import metrics
from dotenv import load_dotenv
import uvicorn
import zipfile
import io

app = FastAPI() 

load_dotenv()
API_KEY = os.getenv("API_KEY")

rutinas_clustering = {
    "kmeans" : kmeans.km,
    "miniBatchKmeans" : minibatchKmeans.mbkm,
    "bisectingKmeans" : bisectingKMeans.bKm,
    "hdbscan" : hdbscan.hd,
    "subtractiveClustering": sustractivo.sub,
}

rutinas_descriptores = {
    "Dynamic Range (DR)" : ds.rangoDinamico,
    "Weighted Generalized Diferences (WGD)" : ds.diferenciasPesadas,
    "Subtraction Average of consecutive pixel intensities (SA)": ds.diferenciasPromediadas,
    "Averaged Diferences (AD)": ds.fujii,
    "Standard Deviation (SD)": ds.desviacionEstandar,
    "Temporal contrast (TC)" : ds.contrasteTemporal,
    "Autocorrelation (AC)": ds.autoCorrelacion,
    "Fuzzy Granularity (FG)": ds.fuzzy,
    "Medium Frequency (MF)": ds.frecuenciaMedia,
    "Shannon Wavelet Entropy (SWE)": ds.entropiaShannon,
    "Cut off Frequency (CF)": ds.frecuenciaCorte,
    "Wavelet Entropy (WE)": ds.waveletEntropy,
    "High to Low Ratio (HLR)": ds.highLowRatio,
    "Low Frequency Energy Band (LFEB)": ds.filtro,
    "Medium Frequency Energy Band (MFEB)": ds.filtro,
    "High Frequency Energy Band (HFEB)": ds.filtro,
    "Significant Changes Count (SCC)": ds.adri,
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
    
    respuesta_imagenes = []
    respuesta_matrices =[]
    for datos in  desc_params:
        nombre = datos['id']
        rutina = rutinas_descriptores.get(nombre)
        print(f"Nombre del descriptor: {nombre}")
        params = datos['params']
        parametros = []
        if (nombre == 'Low Frequency Energy Band (LFEB)' or nombre == 'Medium Frequency Energy Band (MFEB)' or nombre == 'High Frequency Energy Band (HFEB)'):    
            parametros.append(next((param['value'] for param in params if param['paramId'] == 'fmin'), None))
            parametros.append(next((param['value'] for param in params if param['paramId'] == 'fmax'), None))
            parametros.append(next((param['value'] for param in params if param['paramId'] == 'atPaso'), None))
            parametros.append(next((param['value'] for param in params if param['paramId'] == 'atRechazo'), None))
        elif (nombre == 'Weighted Generalized Diferences (WGD)'): 
            parametros.append(next((param['value'] for param in params if param['paramId'] == 'weight'), None))
        elif (nombre == 'Wavelet Entropy (WE)'):
            parametros.append(next((param['value'] for param in params if param['paramId'] == 'wavelet'), None))
            parametros.append(next((param['value'] for param in params if param['paramId'] == 'level'), None))                

        matriz = rutina(tensor,*parametros).tolist()
        imagenes = {"nombre_descriptor" : nombre,"imagen_descriptor" : gi.colorMap(matriz)}
        matrices = {"nombre_descriptor" : nombre,"matriz_descriptor" : matriz}
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
        nombre = datos['id']
        rutina = rutinas_clustering.get(nombre)
        params = datos['params']
        parametros = []
        if (nombre == 'kmeans' or nombre == 'miniBatchKmeans' or nombre == 'bisectingKmeans'):
            parametros.append(next((param['value'] for param in params if param['paramId'] == 'nroClusters'), None))
        elif (nombre == 'hdbscan'):
            parametros.append(next((param['value'] for param in params if param['paramId'] == 'minClusterSize'), None))
            parametros.append(next((param['value'] for param in params if param['paramId'] == 'epsilon'), None))                
        else:
            parametros.append(next((param['value'] for param in params if param['paramId'] == 'ra'), None))
            parametros.append(next((param['value'] for param in params if param['paramId'] == 'rb'), None))
            parametros.append(next((param['value'] for param in params if param['paramId'] == 'eUp'), None))
            parametros.append(next((param['value'] for param in params if param['paramId'] == 'eDown'), None))
        print (nombre , *parametros)
        m, clusters = rutina(tensor,*parametros)
        matriz = m.tolist()
        imagenes = {"nombre_clustering" : nombre,"imagen_clustering" : gi.colorMap(matriz),"nro_clusters":clusters}
        matrices = {"nombre_clustering" : nombre,"matriz_clustering" : matriz, "nro_clusters":clusters}
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
    nro_clusters = matriz_clus['nro_clusters']

    print (entrada.shape)
    print (resultados.shape)

    layers = train_params['neuralNetworkLayers']

    parametros_entrenamiento = np.zeros((len(layers),3))

    for t,datos in enumerate(layers):      
        parametros_entrenamiento[t,0]=float(datos['neurons'])
        parametros_entrenamiento[t,1]=int(datos['batchNorm'])
        parametros_entrenamiento[t,2]=float(datos['dropout'])
    
    params = train_params['neuralNetworkParams']
    epocas = int(params['epocs'])
    b_size = int(params['batchsize'])
    estop = int (params['earlystopping']) 

    print(parametros_entrenamiento)
    
    model, conf_matrix = train.entrenamientoRed(entrada,resultados,nro_clusters,parametros_entrenamiento,epocas,b_size,estop)

    model_path = "modelo_entrenado.keras"
    model.save(model_path)
    '''
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w") as zf:
        zf.write(model_path, arcname="modelo_entrenado.keras")
        zf.writestr("imagen_base64.png", conf_matrix)

    zip_buffer.seek(0)
    '''
    background_tasks.add_task(eliminar_archivo, model_path) 
    
    return FileResponse(model_path, filename="modelo_entrenado.keras", media_type="application/octet-stream")

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

    #resultado = np.argmax(resultado, axis=-1)

    resultado = resultado.reshape(alto,ancho)

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
