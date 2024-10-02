import numpy as np
from scipy.signal import welch
from scipy.stats import entropy
from scipy.signal import ellip, sosfilt, ellipord

def setearDimensiones (tensor):
    global frames
    global alto
    global ancho
    ancho = tensor.shape[0]
    alto = tensor.shape[1]
    frames = tensor.shape[2]

def diferenciasPesadas(tensor):
    peso = 5
    difPesadas = np.zeros((alto,ancho-peso))
    for c in range (ancho-peso):
        difPesadas[:, c] = np.sum(np.abs(tensor[:, c,:] * (peso - 1) - np.sum(tensor[:, c+1:c+peso+1,:])),axis=-1)
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
    return np.std(tensor[:,:,0:frames],axis=2)/np.mean(tensor, axis=2)

def media(tensor):  #devuelve un tensor (ancho, alto, 1) por keepdims
    return np.mean(tensor,axis=2, keepdims=True)

def autoCorrelacion(tensor):
    auto_corr = np.zeros((ancho,alto))
    for i in range(ancho):
        X = tensor[:,i,:]
        desac = np.zeros(alto)
        for j in range(alto):
            x = X[j,: ]- np.mean(X[j,:])
            ac = np.correlate(x,x, mode='full')
            i = len(x)
            ac_aux = np.where(ac[i:]<(ac[i]/2))[0]
            
            if ac_aux.size == 0:
                desac[j] = 0  
            else:
                desac[j]= ac_aux[0] 
            
        auto_corr[:,j]=desac
    return auto_corr

def fuzzy(tensor,threshold):
    diff = np.mean(np.abs(np.diff(tensor, axis=2)),axis=2)
    return np.where(diff < threshold, 1, 0)

def frecuenciaMedia(tensor):
    f, Pxx = welch(tensor)
    return np.sum(Pxx * f, axis=2) /np.sum(Pxx, axis=2)


def entropiaShannon1(tensor):
    _, Pxx = welch(tensor, axis=2)
    return -np.sum ((Pxx /np.sum(Pxx, axis=2, keepdims =True))* np.log2(Pxx/np.sum(Pxx, axis=2, keepdims=True )+ 1e-12), axis=2)


def frecuenciaCorte(tensor):
    
    desc_fc = np.zeros((ancho, alto))

    for w in range(ancho):

        X = tensor[:, w, :]
        X_mean = X - np.mean(X, axis=1, keepdims=True)
        freqs, Pxx = welch(X_mean, axis=1)
        D_PS = Pxx - (Pxx[:, 1:2] / 2)
        
        indice = np.argmax(D_PS[:, 1:] <= 0, axis=1) + 1
        
        desc_fc[w, :] = np.where(Pxx[:, 1] <= 0, 0, freqs[indice])

    return desc_fc #np.where(Pxx[:, 1] <= 0, 0, freqs[indice])

def waveletEntropy(tensor, wavelet='db2', level=5):
    import pywt

    desc_ew = np.zeros((ancho, alto))

    def entropia_por_columnas(x):
        # Realiza la descomposición wavelet
        coeffs = pywt.wavedec(x, wavelet, level=level)
        
        # Coeficiente de aproximación (low-pass) está en coeffs[0]
        # Coeficientes de detalle (high-pass) están en coeffs[1:] para cada nivel
        Ew = np.zeros(level + 1)
        Ew[level] = np.sum(coeffs[0] ** 2)  # Coeficiente de aproximación
        
        for l in range(1, level + 1):
            Ew[level - l] = np.sum(coeffs[l] ** 2)  # Coeficientes de detalle
        
        # Normaliza la energía
        Ew_norm = Ew / np.sum(Ew)
        
        # Calcula la entropía de Shannon
        return -np.sum(Ew_norm * np.log(Ew_norm + 1e-12))

    # Aplica la función a cada fila del tensor
    for w in range(ancho):
        desc_ew[w, :] = np.apply_along_axis(entropia_por_columnas, 1, tensor[:, w, :])

    return desc_ew

import numpy as np
from scipy.signal import welch

def highLowRatio(tensor, fs=1.0):
    
    desc_hlr = np.zeros((ancho, alto))
    
    def hlr_per_column(x):
    
        f, Pxx = welch(x, fs=fs)
        
        energiabaja = np.sum(Pxx[:int(len(f) * 0.25)])
        energiaalta = np.sum(Pxx[int(len(f) * 0.25)+1:])
        
        return energiaalta / energiabaja if energiabaja != 0 else 0

    for w in range(ancho):
        desc_hlr[w, :] = np.apply_along_axis(hlr_per_column, 1, tensor[:, w, :])
    return desc_hlr

def energiaFiltrada(x,sos):
        filtered_signal = sosfilt(sos, x- np.mean(x,axis=-1,keepdims=True), axis=-1)  
        return np.sum(np.abs(filtered_signal) ** 2, axis=-1) / filtered_signal.shape[-1] 

def filtroBajo(tensor, fmin=0.015, fmax=0.05, at_paso=1, at_rechazo=40, fs=1.0):
    
    # Diseño del filtro
    wp = np.array([fmin, fmax]) * 2 / fs
    ws = np.array([fmin - 0.01, fmax + 0.01]) * 2 / fs
    nfe, fne = ellipord(wp, ws, at_paso, at_rechazo)
    sos = ellip(nfe, at_paso, at_rechazo, fne, btype='band', output='sos')
    
    return np.apply_along_axis(energiaFiltrada, 2, tensor,sos)

def filtroMedio(tensor, fmin=0.05, fmax=0.25, at_paso=1, at_rechazo=40, fs=1.0):
    
    # Diseño del filtro
    wp = np.array([fmin, fmax]) * 2 / fs
    ws = np.array([fmin - 0.01, fmax + 0.01]) * 2 / fs
    nfe, fne = ellipord(wp, ws, at_paso, at_rechazo)
    sos = ellip(nfe, at_paso, at_rechazo, fne, btype='band', output='sos')
    
    return np.apply_along_axis(energiaFiltrada, 2, tensor,sos)

def filtroAlto(tensor, fmin=0.025, fmax=0.4, at_paso=1, at_rechazo=40, fs=1.0):
    
    # Diseño del filtro
    wp = np.array([fmin, fmax]) * 2 / fs
    ws = np.array([fmin - 0.01, fmax + 0.01]) * 2 / fs
    nfe, fne = ellipord(wp, ws, at_paso, at_rechazo)
    sos = ellip(nfe, at_paso, at_rechazo, fne, btype='band',output='sos')
    
    return np.apply_along_axis(energiaFiltrada, 2, tensor,sos)