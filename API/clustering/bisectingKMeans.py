'''import numpy as np
from scipy.ndimage import gaussian_filter,sobel

def bc(tensor, radius,nro_clusters=15):
#Calcular el promedio de todas las imágenes en el tensor, obteniendo una única imagen combinada.
#Aplicar un filtro gaussiano para simular una función de densidad.
#Normalizar la densidad para evitar escalas arbitrarias.
#Ajustar la imagen de salida multiplicando la imagen combinada por la densidad obtenida.

    combined_image = np.mean(tensor, axis=2)
    density = gaussian_filter(combined_image, sigma=radius)
    density /= density.max()
    grad_density = sobel(density)
    
    transition_points = np.abs(grad_density) > 0.1
    
    num_clusters = np.sum(transition_points)
    
    max_clusters =10
    
    num_clusters = max(0, min(max_clusters, num_clusters+1))
    
    #print(f"Número de clusters estimado: {num_clusters}")
    
    percentiles = np.percentile(density, np.linspace(0, 100, nro_clusters + 1))
    
    labels = np.digitize(density, bins=percentiles[1:], right=True) - 1
    
    labels = np.clip(labels, 0, num_clusters - 1)
    
    return labels, nro_clusters

    #clustered_image = np.digitize(density, bins=thresholds, right=True) - 1
    #return combined_image * density

    #return np.digitize(density, bins=thresholds, right=True) - 1
'''

from sklearn.cluster import BisectingKMeans

def bKm(tensor, nro_clusters):

    n = int(nro_clusters)

    a,b,c = tensor.shape

    features = tensor.reshape(-1,c)

    bi = BisectingKMeans(n_clusters=n,
                         init='random', 
                         n_init=1, 
                         random_state=None, 
                         max_iter=300, 
                         verbose=0, 
                         tol=0.0001, 
                         copy_x=True, 
                         algorithm='lloyd', 
                         bisecting_strategy='biggest_inertia').fit(features)
    labels = bi.labels_ 

    n_clusters_ = len(set(labels)) - (1 if -1 in labels else 0)
    labels+=1
    return labels.reshape(a,b), n_clusters_