import numpy as np
from sklearn.cluster import SpectralClustering

def sc (tensor, nro_clusters):

    '''
    a,b,c = tensor.shape

    features = tensor.reshape(-1, tensor.shape[-1])

    spectral = SpectralClustering(n_clusters=nro_clusters, affinity='nearest_neighbors',assign_labels='discretize', n_init=100)
    labels = spectral.fit_predict(features)
    
    return labels.reshape(a,b)
    '''
    return tensor[:,:,0]