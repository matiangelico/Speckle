from fastapi import FastAPI, File, UploadFile, Form 
import descriptores as ds
import numpy as np
import json
import aviamat
import generaImagen
import kmeans
import spectralClustering

app = FastAPI()

rutinas_ia = {
    "K-Means" : kmeans.km,
    "Spectral Clustering" : spectralClustering.sc,
    "Sustractive Clustering" : 'no hace nada aun',
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

@app.post("/calc")
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

@app.post("/ia")
async def calcularDescriptores(jsonFile1: UploadFile = File(), jsonFile2: UploadFile = File()):

    descriptores_json = await jsonFile1.read()
    descriptores = json.loads(descriptores_json)

    ia_json = await jsonFile2.read()
    ia = json.loads(ia_json)

    
    desc = descriptores['descriptores']
    total = len(desc)
    print(f"Nro de matrices de descriptores recibidas: {total}")
    print(f"Nro de ia a procesar: {len(ia)}")

    tensor = np.zeros((len (desc[0]),len (desc[1]),total))

    for t, datos in enumerate(desc):
        tensor[:, :, t] = np.array(datos)
    
    respuesta = []
    for datos in ia:
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