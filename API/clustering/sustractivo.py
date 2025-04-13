import numpy as np
from numba import njit, prange

def subtractive_clustering(data, ra, rb, Eup, Edown, max_clusters = 20):

    ra = float(ra)
    rb = float(rb)
    Eup = float(Eup)
    Edown = float(Edown)
    
    potential = compute_potential(data, ra)
    
    max_potential_value = np.max(potential)
    max_potential_index = np.argmax(potential)
    cluster_centers = []

    supero20 = False
    
    while max_potential_value > 0:
        max_potential_vector = data[max_potential_index]
        potential_ratio = max_potential_value / np.max(potential)

        if len(cluster_centers) >= max_clusters:  
            supero20 = True
            break
        
        if potential_ratio > Eup:
            cluster_centers.append(max_potential_vector)
            update_potential(potential, data, max_potential_vector, max_potential_value, rb)
        elif potential_ratio > Edown:
            dmin = np.min([np.sum((max_potential_vector - c) ** 2) for c in cluster_centers]) if cluster_centers else np.inf
            if (dmin / ra) + potential_ratio >= 1:
                cluster_centers.append(max_potential_vector)
                update_potential(potential, data, max_potential_vector, max_potential_value, rb)
            else:
                potential[max_potential_index] = 0
        else:
            break
        
        max_potential_value = np.max(potential)
        max_potential_index = np.argmax(potential)

    if (len(cluster_centers)==0)or supero20:
        if supero20:
            print('mas de 20')
        else:
            print ('No clusters')
        return None
    return np.array(cluster_centers)

@njit(parallel=True)
def compute_potential(data, ra):
    size = data.shape[0]
    potential = np.zeros(size)
    for i in prange(size):
        for j in range(i + 1, size):
            value = np.exp(-4.0 * np.sum((data[i] - data[j]) ** 2) / (ra / 2) ** 2)
            potential[i] += value
            potential[j] += value
    return potential

@njit(parallel=True)
def update_potential(potential, data, max_vector, max_value, rb):
    size = data.shape[0]
    for i in prange(size):
        potential_value = potential[i] - (max_value * np.exp(-4.0 * np.sum((max_vector - data[i]) ** 2) / (rb / 2) ** 2))
        potential[i] = max(0, potential_value)

def classify_points(data, a, b, cluster_centers):  
    labels = np.zeros(data.shape[0], dtype=np.int32)
    if cluster_centers.shape[0] != 0:
        for i in range(data.shape[0]):
            labels[i] = np.argmin(np.sum((cluster_centers - data[i]) ** 2, axis=1))
        return labels.reshape(a, b)
    else:
        return None 

def sub(tensor, ra,rb,Eup,Edown):
    a,b,c = tensor.shape
    data = tensor.reshape(-1, c)
    print(data.shape)
    cluster_centers = subtractive_clustering(data,ra,rb,Eup,Edown)
    if cluster_centers is not None:
        resultado = classify_points(data, a, b, cluster_centers) 
        resultado +=1
        return (resultado, len(cluster_centers)) if resultado is not None else None  
    else:
        return None