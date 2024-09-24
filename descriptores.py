import numpy as np
from scipy.stats import entropy

frames = 0

def setearFrames (nroFrames):
    global frames
    frames = nroFrames

def diferenciasPesadas(tensor):
    alto = tensor.shape[0]
    ancho = tensor.shape[1]
    peso = 5
    difPesadas = np.zeros((alto,ancho,frames-peso))
    for c in range(frames - peso):
        difPesadas[:, :, c] = np.abs(tensor[:, :, c] * (peso - 1) - np.sum(tensor[:, :, c+1:c+peso+1], axis=2))
    return difPesadas


def diferenciasPromediadas(tensor):
    return np.sum(np.abs(tensor[:,:,0:frames-1]-tensor[:,:,1:frames]),axis=2)/(frames-1)

def fujii(tensor):
    x1 =np.abs(tensor[:,:,0:frames-1]-tensor[:,:,1:frames])
    x2 =np.abs(tensor[:,:,0:frames-1]+tensor[:,:,1:frames])
    x2[x2 == 0] = 1
    return np.sum(x1/x2,axis=2)

def entropiaShannon(tensor):
    
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

def desviacionEstandar(tensor):
    return np.std(tensor[:,:,0:frames],axis=2)

def contrasteTemporal(tensor):
    return np.std(tensor[:,:,0:frames],axis=2)/media(tensor)

def media(tensor):
    return np.mean(tensor,axis=2, keepdims=True)

def autocorrelacionFFT(tensor): #tarda un 25% menos que haciendo los dos ciclos for
    from numpy.fft import fft, ifft 
    tensor_fft = fft(tensor, n=2*frames-1, axis=2)
    result = np.real(ifft(tensor_fft * np.conj(tensor_fft),axis=2))
    return np.concatenate((result[:,:,frames:],result[:,:,:frames]),axis=2)

def autoCorrelacion(tensor):
    auto_corr = np.zeros((tensor.shape[0],tensor.shape[1],frames*2-1))
    for i in range(tensor.shape[0]):
        for j in range(tensor.shape[1]):
            auto_corr[i, j, :] = np.correlate(tensor[i, j, :], tensor[i, j, :], mode='full')
        
    return auto_corr

def fuzzy(tensor,threshold):
    diff = np.abs(np.diff(tensor, axis=2))
    return np.where(diff > threshold, 1, 0)

def frecuenciaMedia(tensor):
    from scipy.signal import welch
    f, Pxx = welch(tensor)
    return np.sum(Pxx * f, axis=2) /np.sum(Pxx, axis=2)


def entropiaShannon1(tensor):
    from scipy.signal import welch
    _, Pxx = welch(tensor, axis=2)
    return -np.sum ((Pxx /np.sum(Pxx, axis=2, keepdims =True))* np.log2(Pxx/np.sum(Pxx, axis=2, keepdims=True )+ 1e-12), axis=2)

def frecuenciaCorte(tensor):
    from scipy.signal import welch
    #f , Pxx = welch(tensor - media(tensor))
    #f_welch, x_PSD = welch(x - np.mean(x))
    '''
    Pxx_half = np.expand_dims(Pxx[1], axis=0) / 2
    return 0 if np.all(Pxx[1] <= 0) else (
        f[-1] if len(np.where(Pxx) - Pxx_half <= 0)[0] == 0 
        else f[np.where(Pxx - Pxx_half <= 0)[0][0] + 1]
    )
    '''
    f_welch, x_PSD = welch(tensor - np.mean(tensor))
    
    # Verificar si el segundo valor de x_PSD es <= 0
    if np.all(x_PSD[1] <= 0,axis=2):
        return 0
    else:
        # Calcular la diferencia del PSD con respecto a la mitad del segundo valor
        D_PS = x_PSD - x_PSD[1] / 2
        # Encontrar la primera frecuencia donde D_PS es menor o igual a 0
        ll = np.where(D_PS[1:] <= 0)[0]
        
        if len(ll) == 0:
            # Si no se encuentra ninguna frecuencia, usar la última frecuencia disponible
            return f_welch[-1]
        else:
            # Devolver la frecuencia correspondiente
            return f_welch[ll[0] + 1]
    #return -np.sum ((Pxx /np.sum(Pxx, axis=2, keepdims =True))* np.log2(Pxx/np.sum(Pxx, axis=2, keepdims=True )+ 1e-12), axis=2)
