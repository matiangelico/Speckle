import numpy as np

def diferenciasPromediadas(tensor):
    frames = tensor.shape[2]
    return np.sum(np.abs(tensor[:,:,0:frames-1]-tensor[:,:,1:frames]),axis=2)/(frames-1)

def fujii(tensor):
    frames = tensor.shape[2]
    x1 =np.abs(tensor[:,:,0:frames-1]-tensor[:,:,1:frames])
    x2 =np.abs(tensor[:,:,0:frames-1]+tensor[:,:,1:frames])
    x2[x2 == 0] = 1
    return np.sum(x1/x2,axis=2)

def desviacionEstandar(tensor):
    frames = tensor.shape[2]
    return np.std(tensor[:,:,0:frames],axis=2)

def contrasteTemporal(tensor):
    frames = tensor.shape[2]
    return np.std(tensor[:,:,0:frames],axis=2)/media(tensor)

def media(tensor):
    frames = tensor.shape[2]
    return np.mean(tensor[:,:,0:frames],axis=2)

def correlacionCruzada(tensor):
    return np.apply_along_axis(correlacionCruzada1d,axis=2, arr = tensor)

def correlacionCruzada1d(arr):
    return np.correlate(arr, arr, mode='full')