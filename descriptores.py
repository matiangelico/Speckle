import numpy as np
from scipy.signal import welch
from scipy.stats import entropy

def diferenciasPromediadas(tensor):
    frames = tensor.shape[2]
    return np.sum(np.abs(tensor[:,:,0:frames-1]-tensor[:,:,1:frames]),axis=2)/(frames-1)

def fujii(tensor):
    frames = tensor.shape[2]
    x1 =np.abs(tensor[:,:,0:frames-1]-tensor[:,:,1:frames])
    x2 =np.abs(tensor[:,:,0:frames-1]+tensor[:,:,1:frames])
    x2[x2 == 0] = 1
    return np.sum(x1/x2,axis=2)

def entropiaShannon(tensor):

    frames = tensor.shape[2]
    
    # Inicializar una matriz para almacenar la entropía de Shannon para cada píxel
    entropy_matrix = np.zeros(tensor.shape[:2])
    
    # Iterar sobre cada píxel de la imagen (en las dos primeras dimensiones)
    for i in range(tensor.shape[0]):  # Recorrer filas
        for j in range(tensor.shape[1]):  # Recorrer columnas
            # Extraer la señal (valores de los frames) para el píxel (i,j)
            signal = tensor[i, j, :]

            # Calcular la distribución de probabilidad de la señal
            hist, _ = np.histogram(signal, bins=256, range=(0, 256), density=True)
            hist = hist[hist > 0]  # Eliminar ceros para evitar problemas con log2
            
            # Calcular la entropía de Shannon
            entropy_matrix[i, j] = entropy(hist, base=2)
    
    return entropy_matrix
