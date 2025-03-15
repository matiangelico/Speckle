import numpy as np
from scipy.signal import welch, ellip, sosfilt, ellipord

def setearDimensiones (tensor):
    global frames
    global alto
    global ancho 
    ancho = tensor.shape[1]
    alto = tensor.shape[0]
    frames = tensor.shape[2]

def rangoDinamico(tensor):
    setearDimensiones(tensor)
    return np.max(tensor, axis=-1)-np.min(tensor,axis=-1)

def diferenciasPesadas(tensor, peso):
    peso = int(peso)
    setearDimensiones(tensor)
    X = tensor.astype(np.float32)
    difPesadas = np.zeros((alto, ancho), dtype=np.float32)
    for f in range(frames - peso):
        difPesadas += np.abs(X[:, :, f] * (peso - 1) - np.sum(X[:, :, f + 1: f + peso + 1], axis=2))    
    return difPesadas

def diferenciasPromediadas(tensor):
    setearDimensiones(tensor)
    tensor = tensor[:, :, :].astype(np.float32)
    return np.sum(np.abs(tensor[:,:,0:frames-1]-tensor[:,:,1:frames]),axis=2)/(frames-1)

def fujii(tensor):
    setearDimensiones(tensor)
    tensor = tensor[:, :, :].astype(np.float32)
    x1 =np.abs(tensor[:,:,1:frames]-tensor[:,:,0:frames-1])
    x2 =np.abs(tensor[:,:,1:frames]+tensor[:,:,0:frames-1])
    x2[x2 == 0] = 1
    return np.sum(x1/x2,axis=2)

def desviacionEstandar(tensor):
    return np.std(tensor[:,:,:],axis=2)

def contrasteTemporal(tensor):
    media = np.mean(tensor, axis=2)
    std = np.std(tensor, axis=2)
    return np.divide(std, media, where=media > 0, out=np.zeros_like(media))
    

def autoCorrelacion(tensor):
    setearDimensiones(tensor)  
    desac = np.zeros((alto, ancho))

    for j in range(ancho):
        x = tensor[:, j, :] - np.mean(tensor[:, j, :], axis=1, keepdims=True)
        ac = np.array([np.correlate(row, row, mode='full') for row in x])
        ac_aux = np.argmax(ac[:, frames-1:2*frames-2] <= (ac[:, frames-1] / 2)[:, None], axis=1)
        desac[:, j] = np.where(ac_aux == 0, 0, ac_aux + 1)

    return desac

def fuzzy(tensor):
    setearDimensiones(tensor)
    intervalos = np.percentile(tensor[:,:,0], [20,40,60,80],method='nearest')

    act = ff = np.zeros((alto,ancho,3))
    for f in range (frames):
        fn = np.zeros((alto,ancho,3))
        arr = tensor[:,:,f]
        fn[:,:,0] = np.logical_and(arr >= 0, arr <= intervalos[1]).astype(int)
        fn[:,:,1] = np.logical_and(arr >= intervalos[0], arr <= intervalos[3]).astype(int)
        fn[:,:,2] = np.logical_and(arr >= intervalos[2], 255).astype(int)

        dif = ff - fn
        iac = np.where(dif == 1)
        act[iac] += 1
        ff = fn

    return np.sum(act, axis=-1) / frames

def frecuenciaMedia(tensor):
    setearDimensiones(tensor)
    f, Pxx = welch(tensor, window='hamming', nperseg= frames //8)
    suma = np.sum(Pxx, axis=2)
    suma [suma == 0] = np.finfo(np.float32).eps
    return np.sum(Pxx * f, axis=2) / suma

def entropiaShannon(tensor):
    setearDimensiones(tensor)
    _,Pxx = welch(tensor.astype(np.float32), window='hamming', nperseg= frames //8)
    suma_Pxx = np.sum(Pxx, axis=-1, keepdims=True)
    suma_Pxx[suma_Pxx == 0] = np.finfo(np.float32).eps
    prob = Pxx / suma_Pxx
    prob = np.where(prob > 0, prob, np.finfo(np.float32).eps)
    return (-np.sum (prob * np.log10(prob), axis=-1))
    
def frecuenciaCorte(tensor):
    setearDimensiones(tensor)
    tensor = tensor.astype(np.float32)
    desc_fc = np.zeros((alto, ancho))

    def frecuencia_por_columnas(x):
        freqs, Pxx = welch(x-np.mean(x), window='hamming', nperseg=frames//8)
        if Pxx[1]<= 0:
            a=0                
        else:
            D_PS = Pxx - Pxx[1]/ 2
            indices = np.where(D_PS[1:] <= 0)[0]      
            a = freqs[-1] if (indices.size==0) else freqs[indices[0]+1]
        return a
    
    for w in range(ancho):
        desc_fc[:,w] = np.apply_along_axis(frecuencia_por_columnas,-1,tensor[:,w,:])

    return desc_fc


def waveletEntropy(tensor,wavelet,level):
    setearDimensiones(tensor)
    level = int(level)
    import pywt
    tensor = tensor.astype(np.float32)
    desc_ew = np.zeros((alto, ancho))

    def entropia_por_columnas(x):
    
        coeffs = pywt.wavedec(x, wavelet, level=level)
        Ew = np.zeros(level + 1)
        Ew[level] = np.sum(coeffs[0] ** 2)
        
        for l in range(1, level + 1):
            Ew[level - l] = np.sum(coeffs[l] ** 2) 
        
        Ew_sum = np.sum(Ew)

        Ew_norm = Ew / Ew_sum if Ew_sum >0 else np.zeros_like(Ew)
        
        return -np.sum(Ew_norm * np.log(Ew_norm + 1e-12))

    for w in range(ancho):
        desc_ew[:,w] = np.apply_along_axis(entropia_por_columnas, 1, tensor[:, w, :])

    return desc_ew

def highLowRatio(tensor):
    setearDimensiones(tensor)

    freqs, Pxx = welch(tensor, window='hamming', nperseg=frames // 8, axis=2)
    corte = int(len(freqs) * 0.25)
    energiabaja = np.sum(Pxx[:, :, :corte], axis=2) 
    energiaalta = np.sum(Pxx[:, :, corte + 1:], axis=2) 

    return np.divide(energiaalta, energiabaja, where=energiabaja > 0, out=np.zeros_like(energiaalta))
    


def energiaFiltrada(x,sos):
        filtered_signal = sosfilt(sos, x- np.mean(x,axis=-1,keepdims=True), axis=-1)  
        return (np.sum(np.abs(filtered_signal) ** 2, axis=-1) / filtered_signal.shape[-1] ).astype(np.float32)

def disenioFiltro(fmin,fmax,at_paso,at_rechazo):
    nfe, fne = ellipord(np.array([fmin*2, fmax*2]), np.array([fmin*2 - 0.01, fmax*2 + 0.01]), at_paso, at_rechazo)
    return ellip(nfe, at_paso, at_rechazo, fne, btype='band',output='sos') 

def filtro(tensor, fmin, fmax, at_paso,at_rechazo):
    fmin = float(fmin)
    fmax = float(fmax)
    at_paso = float(at_paso)
    at_rechazo = float(at_rechazo)
    return np.apply_along_axis(energiaFiltrada, 2, tensor, disenioFiltro(fmin,fmax,at_paso,at_rechazo))

def adri(tensor):
    setearDimensiones(tensor)
    tensor = tensor[:, :,:].astype(np.float16)
    m1 = (np.abs(tensor[:, :, 1]- tensor[:, :, 0])).flatten()
    um = np.mean(m1[m1 != 0]) 

    desAdri = np.zeros((alto,ancho))
    
    for k in range(1, frames):
        difer = tensor[:, :, k] - tensor[:, :, k - 1]
        desAdri += np.abs(difer) > um

    return (desAdri/(frames-1))