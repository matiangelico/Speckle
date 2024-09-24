import numpy as np

def diferenciasPesadas(tensor):
    alto = tensor.shape[0]
    ancho = tensor.shape[1]
    frames = tensor.shape[2] 
    peso = 5
    difPesadas = np.zeros((alto,ancho,frames-peso))
    for c in range(frames - peso):
        difPesadas[:, :, c] = np.abs(tensor[:, :, c] * (peso - 1) - np.sum(tensor[:, :, c+1:c+peso+1], axis=2))
    return difPesadas
