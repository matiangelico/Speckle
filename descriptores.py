import numpy as np

def diferenciasPromediadas(tensor):
    frames = tensor.shape[2]
    return np.sum(np.abs(tensor[:,:,0:frames-1]-tensor[:,:,1:frames]),axis=2)/(frames-1)
