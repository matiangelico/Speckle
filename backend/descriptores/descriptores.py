import numpy as np
from scipy.signal import welch
from scipy.signal import ellip, sosfilt, ellipord

def setearDimensiones (tensor):
    global frames
    global alto
    global ancho
    ancho = tensor.shape[0]
    alto = tensor.shape[1]
    frames = tensor.shape[2]

def rangoDinamico(tensor):
    return np.array(np.max(tensor, axis=-1)-np.min(tensor,axis=-1)).astype(np.float64)

def diferenciasPesadas(tensor, peso=5):
    tensor = tensor[:, :, :frames].astype(np.float64)
    difPesadas = np.zeros((alto,ancho))
    for c in range (ancho):
        X = tensor[:,c,:]
        a = np.zeros(alto)  
        for f in range (frames-peso):
            a += np.abs(X[:,f] * (peso - 1) - np.sum(X[:, f+1:f+peso+1],axis=1))
        difPesadas[:,c]= a
    return difPesadas

def diferenciasPromediadas(tensor):
    tensor = tensor[:, :, :frames].astype(np.float64)
    return np.sum(np.abs(tensor[:,:,0:frames-1]-tensor[:,:,1:frames]),axis=2)/(frames-1)


def fujii(tensor):
    tensor = tensor[:, :, :frames].astype(np.float64)
    x1 =np.abs(tensor[:,:,1:frames]-tensor[:,:,0:frames-1])
    x2 =np.abs(tensor[:,:,1:frames]+tensor[:,:,0:frames-1])
    x2[x2 == 0] = 1
    return np.sum(x1/x2,axis=2)

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
            ac = np.correlate(x,x,mode='full')
            ac_aux = np.where(ac[frames-1:frames*2-2]<=(ac[frames-1]/2))[0]
            if ac_aux.size == 0:
                ac_aux = 0  
            desac[j]= ac_aux[0]+1
        auto_corr[:,i]=desac
    return auto_corr

def fuzzy(tensor):

    def roicolor(arr, low, high):
        return np.logical_and(arr >= low, arr <= high).astype(int)

    ##Calculo de intervalos
    x = tensor[:,:,0].astype(np.uint8)
    h,_ = np.histogram(x, bins=256,range=(0,255))
    maximo = np.max(x).astype(np.uint16)
    suma = np.cumsum(h[:maximo+1])
    p = suma[maximo-1]/5
    pp = np.zeros ((maximo+1,4))
    for j in range (4):
        pp[:,j] = suma - p*(j+1)
    intervalos = np.argmin(np.abs(pp),axis=0)
    #print (intervalos)

    fuzzy = np.zeros((ancho,alto))

    for c in range(ancho):
        X = tensor[:,c,:].astype(np.float64)
        act = np.zeros((alto,3))
        ff = np.zeros((alto,3))
        for f in range (alto):
            fn = np.zeros((alto,3))
            fn[:, 0] = roicolor(X[:, f], 0,intervalos[1])
            fn[:, 1] = roicolor(X[:, f], intervalos[0], intervalos[3])
            fn[:, 2] = roicolor(X[:, f], intervalos[2], 255)

            dif = ff - fn
            iac = np.where(dif == 1)

            act[iac] += 1

            ff = fn.copy()

            desc = np.sum(act, axis=1) / frames
    
        fuzzy[:,c] = desc 
    return fuzzy

def frecuenciaMedia(tensor):
    f, Pxx = welch(tensor)
    return np.sum(Pxx * f, axis=2) /np.sum(Pxx, axis=2)


def entropiaShannon(tensor):
    
    tensor = tensor[:, :,:].astype(np.float64)
    _,Pxx = welch(tensor,nperseg=256)
    prob = Pxx /np.sum(Pxx,axis=-1,keepdims =True)
    '''
    entropia = np.zeros((alto,ancho))
    entropiaShannon = np.zeros((alto,ancho))
    for w in range(ancho):
        X = tensor[:,w,:]
        #_,i = X.shape
        for i in range(alto):
            x = X[i,:]
            _,Pxx = welch(x)
            prob = Pxx /(np.sum(Pxx)+1e-12)
            entropia[i,w]= -np.sum (prob * np.log10(prob +1e-12))
        entropiaShannon[w,:]=entropia[:,w]
    return entropiaShannon.transpose()
    '''
    return -np.sum (prob * np.log10(prob), axis=-1)

def frecuenciaCorte(tensor):
    tensor = tensor[:, :, :frames]
    desc_fc = np.zeros((ancho, alto))

    for w in range(ancho):
        X = tensor[:, w, :]
        for i in range(alto):
            x = X[i,:]
            xm = x - np.mean(x)
            freqs, Pxx = welch(xm, fs=2,window='hamming')
            
            if Pxx[1]<= 0:
                desc_fc[w,i]=0                
            else:
                D_PS = Pxx - Pxx[1] / 2
                indices = np.where(D_PS[1:] <= 0)[0]      
                if indices.size==0:                    
                    desc_fc[w,i]= freqs[Pxx.size-1]  
                else:
                    desc_fc[w,i]= freqs[indices[0]+1]
    return desc_fc

def waveletEntropy(tensor, wavelet='db2', level=5):
    import pywt

    tensor = tensor[:, :, :frames].astype(np.float64)

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
        
        Ew_norm = Ew / np.sum(Ew)
        
        return -np.sum(Ew_norm * np.log(Ew_norm + 1e-12))

    for w in range(ancho):
        desc_ew[:,w] = np.apply_along_axis(entropia_por_columnas, 1, tensor[:, w, :])

    return desc_ew

def highLowRatio(tensor, fs=1.0):

    tensor = tensor[:, :, :]
    desc_hlr = np.zeros((ancho, alto))

    for w in range(ancho):
        X = tensor[:, w, :]
        for i in range(alto):
            x = X[i,:]
            freqs, Pxx = welch(x, fs=fs)
            energiabaja = np.sum(Pxx[:int(len(freqs) * 0.25)])
            energiaalta = np.sum(Pxx[int(len(freqs) * 0.25)+1:])
            desc_hlr[i,w]= (energiaalta / energiabaja) 
    return desc_hlr

    '''def hlr_per_column(x):
    
        f, Pxx = welch(x, fs=fs, window='hamming')
        
        energiabaja = np.sum(Pxx[:int(len(Pxx) * 0.25)])
        energiaalta = np.sum(Pxx[int(len(Pxx) * 0.25)+1:])
        
        return energiaalta / energiabaja if energiabaja != 0 else 0

    for w in range(ancho):
        desc_hlr[:,w] = np.apply_along_axis(hlr_per_column, 1, tensor[:, w, :])
   
    return desc_hlr'''

def energiaFiltrada(x,sos):
        filtered_signal = sosfilt(sos, x- np.mean(x,axis=-1,keepdims=True), axis=-1)  
        return np.sum(np.abs(filtered_signal) ** 2, axis=-1) / filtered_signal.shape[-1] 

def disenioFiltro(fmin,fmax,at_paso,at_rechazo):
    wp = np.array([fmin*2, fmax*2])
    ws = np.array([fmin*2 - 0.01, fmax*2 + 0.01])
    nfe, fne = ellipord(wp, ws, at_paso, at_rechazo)
    return ellip(nfe, at_paso, at_rechazo, fne, btype='band',output='sos') 

def filtroBajo(tensor, fmin=0.015, fmax=0.05, at_paso=1, at_rechazo=40, fs=1.0):
    return np.apply_along_axis(energiaFiltrada, 2, tensor,disenioFiltro(fmin,fmax,at_paso,at_rechazo))

def filtroMedio(tensor, fmin=0.05, fmax=0.25, at_paso=1, at_rechazo=40, fs=1.0): 
    return np.apply_along_axis(energiaFiltrada, 2, tensor,disenioFiltro(fmin,fmax,at_paso,at_rechazo))

def filtroAlto(tensor, fmin=0.25, fmax=0.4, at_paso=1, at_rechazo=40, fs=1.0):
    return np.apply_along_axis(energiaFiltrada, 2, tensor,disenioFiltro(fmin,fmax,at_paso,at_rechazo))