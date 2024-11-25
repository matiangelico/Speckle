from fastapi import FastAPI, File, UploadFile
import scipy.io
import io
import descriptores as ds
import numpy as np

app = FastAPI()

async def cargaAdjunto(file):
    file_content = await file.read()
    data = scipy.io.loadmat(io.BytesIO(file_content))
    return np.array(data['video_data']).transpose(1,2,0) 

@app.post("/rangoDinamico")
async def rangoDinamico(file: UploadFile = File(...)):
    m = await cargaAdjunto(file)
    return  (ds.rangoDinamico(m)).tolist()

@app.post("/diferenciasPesadas")
async def diferenciasPesadas(file: UploadFile = File(...)):
    m = await cargaAdjunto(file)
    return ds.diferenciasPesadas(m).tolist()

@app.post("/diferenciasPromediadas")
async def diferenciasPromediadas(file: UploadFile = File(...)):
    m = await cargaAdjunto(file)
    return ds.diferenciasPromediadas(m).tolist()

@app.post("/fujii")
async def fujii(tensor):
    return ds.fujii(tensor)

@app.post("/desviacionEstandar")
async def desviacionEstandar(tensor):
    return ds.desviacionEstandar(tensor)

@app.post("/contrasteTemporal")
async def contrasteTemporal(tensor):
    return ds.contrasteTemporal(tensor)

@app.post("/autocorrelacion")
async def autoCorrelacion(tensor):
    return ds.autoCorrelacion(tensor)

@app.post("/fuzzy")
async def fuzzy(tensor):
    return ds.fuzzy(tensor)

@app.post("/frecuenciaMedia")
async def frecuenciaMedia(tensor):
    return ds.frecuenciaMedia(tensor)

@app.post("/entropiaShannon")
async def entropiaShannon(tensor):
    return ds.entropiaShannon(tensor)

@app.post("/frecuenciaCorte")
async def frecuenciaCorte(tensor):
    return ds.frecuenciaCorte(tensor)

@app.post("/waveletEntropy")
async def waveletEntropy(tensor):
    return ds.waveletEntropy(tensor)

@app.post("/highLowRatio")
async def highLowRatio(tensor):
    return ds.highLowRatio(tensor)

@app.post("/filtroBajo")
async def filtroBajo(tensor):
    return ds.filtroBajo(tensor)

@app.post("/filtroMedio")
async def filtroMedio(tensor):
    return ds.filtroMedio(tensor)

@app.post("/filtroAlto")
async def filtroAlto(tensor):
    return ds.filtroAlto(tensor)

@app.post("/adri")
async def adri(tensor):
    return ds.adri(tensor)


