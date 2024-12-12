from fastapi import FastAPI, File, UploadFile, Form 
import descriptores as ds
import numpy as np
import json
import aviamat
import generaImagen

app = FastAPI()

rutinas = {
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
        print(f"Nombre del descriptor: {datos['name']}")
        rutina = rutinas.get(datos['name'])
        for parametro in datos['params']:
            parametros.append(parametro['value'])    
        matriz = rutina(tensor,*parametros).tolist()
        res = {
            "nombre" : datos['name'],
            "matriz" : matriz,
            "imagen" : generaImagen.generate_color_map(matriz),
        }
        respuesta.append(res)
    return respuesta