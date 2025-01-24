import numpy as np
from skimage.transform import resize, downscale_local_mean
from scipy.spatial import cKDTree

'''def sus(tensor, radius, num_clusters = 50):
    
    height, width, _ = tensor.shape
    
    # Promedio de las imágenes para obtener una representación inicial
    combined_image = np.mean(tensor, axis=2)
     
    # Crear una matriz de densidad utilizando un filtro gaussiano
    y, x = np.meshgrid(np.arange(height), np.arange(width), indexing='ij')
    density = np.zeros_like(combined_image)
    
    # Usar una matriz de distancia para optimizar el cálculo
    for i in range(-radius, radius + 1):
        for j in range(-radius, radius + 1):
            # Asegurarse de que los índices se mantengan dentro de los límites
            valid_x = (x + j >= 0) & (x + j < width)
            valid_y = (y + i >= 0) & (y + i < height)
            mask = valid_x & valid_y
            
            dist_map = np.sqrt((x[mask] - (x[mask] + j))**2 + (y[mask] - (y[mask] + i))**2)
            
            # Comprobar si hay valores dentro de la máscara
            if dist_map.size > 0:
                density[mask] += np.exp(-dist_map**2 / (2 * radius**2))

    # Normalizar la densidad
    max_density = np.max(density)
    output_image = combined_image * (density / max_density)
    #return output_image

    thresholds = np.linspace(0, 1, num_clusters)  # Umbrales para los clusters (desde 0 hasta 1)
    
    # Clasificar cada valor de densidad en un cluster
    #clustered_image = np.digitize(density, bins=thresholds, right=True) - 1

    #return combined_image * density
    return np.digitize(output_image, bins=thresholds, right=True) - 1

def sus(tensor, radio=5.0):
    penalizacion=0.9
    muestreo = 0.2
    h, w, d = tensor.shape
    puntos = tensor.reshape(-1, d)  # Matriz de (90000, 17)

    # Aumentamos el muestreo si es muy bajo
    muestreo = max(muestreo, 0.15)  # Nunca menos del 15%
    
    # Selección de puntos para muestreo
    num_muestra = int(len(puntos) * muestreo)
    idx_muestra = np.random.choice(len(puntos), num_muestra, replace=False)
    puntos_muestra = puntos[idx_muestra]

    # Construcción del árbol KD optimizado
    tree_muestra = cKDTree(puntos_muestra)

    # Paso 1: Cálculo rápido de densidad con vecindad limitada
    vecinos = tree_muestra.query_ball_point(puntos_muestra, radio)
    densidad = np.array([len(v) for v in vecinos], dtype=np.float32)
    densidad /= np.max(densidad)  # Normalización de la densidad

    # Paso 2: Selección de centros de cluster
    etiquetas_muestra = -np.ones(len(puntos_muestra), dtype=int)  # Inicializamos etiquetas
    centros = []
    
    while np.max(densidad) > 0.1:  # Se usa un umbral para evitar que termine muy pronto
        idx_max = np.argmax(densidad)
        centros.append(idx_max)
        etiquetas_muestra[idx_max] = len(centros) - 1

        # Penalización más gradual
        vecinos = tree_muestra.query_ball_point(puntos_muestra[idx_max], radio * penalizacion)
        densidad[vecinos] *= 0.8  

    # Paso 3: Asignación de clusters a todos los puntos
    tree_total = cKDTree(puntos)
    _, nearest = tree_total.query(puntos_muestra[centros], k=1)

    etiquetas_total = np.full(len(puntos), -1, dtype=int)
    etiquetas_total[idx_muestra] = etiquetas_muestra  # Asignar clusters a la muestra
    etiquetas_total[nearest] = etiquetas_muestra[centros]  # Expandir clusters

    # Asignar etiquetas a los puntos sin cluster (asignarles el más cercano)
    sin_cluster = etiquetas_total == -1
    if np.any(sin_cluster):
        _, nearest_fallback = tree_total.query(puntos[sin_cluster], k=1)
        etiquetas_total[sin_cluster] = etiquetas_total[nearest_fallback]

    # Reconstrucción del mapa de clusters
    return etiquetas_total.reshape(h, w)
'''
def sus(tensor, radius):
    
    a, b, _ = tensor.shape

    # Reducir dimensiones espaciales a la mitad
    tensor_reducido = downscale_local_mean(tensor, (2, 2, 1)).astype(np.float32)  # Forma: (a//2, b//2, c)

    # Preparar datos para clustering
    h, w, d = tensor_reducido.shape
    data = tensor_reducido.reshape(-1, d)

    k = 1.5
    # Inicialización de parámetros
    n_points = data.shape[0]
    potential = np.zeros(n_points)
    influence_radius = radius * k * np.sqrt(np.sum(np.var(data, axis=0)))

    tree = cKDTree(data)

    for i in range(n_points):
        diff = data - data[i]
        dist_squared = np.sum(diff ** 2, axis=1)
        potential[i] = np.sum(np.exp(-dist_squared / (influence_radius ** 2)))

    # Identificar clusters
    labels = np.full(n_points, -1, dtype=int)
    cluster_centers = []
    cluster_id = 0

    while np.max(potential) > 0:
        # Seleccionar el punto con mayor potencial como centro de cluster
        center_idx = np.argmax(potential)
        cluster_centers.append(data[center_idx])
        labels[center_idx] = cluster_id

        # Reducir el potencial de puntos cercanos
        neighbors = tree.query_ball_point(data[center_idx], influence_radius)
        for neighbor in neighbors:
            potential[neighbor] -= potential[center_idx] * k
        cluster_id += 1
    
    final_centers = []
    threshold_distance = 0.006 * influence_radius 
    max_clusters = 20
    for center in cluster_centers:
        if len(final_centers) < max_clusters:
            if all(np.linalg.norm(center - c) > threshold_distance for c in final_centers):
                final_centers.append(center) 

    for i in range(n_points):
        distances = [np.sum((data[i] - center) ** 2) for center in final_centers]
        labels[i] = np.argmin(distances)

    labels_reducidos = labels.reshape(h, w)

    print('Clusters finales:', len(final_centers))

    labels_escalados = resize(labels_reducidos, (a, b), order=0, preserve_range=True).astype(int)

    return labels_escalados
'''
    # Asignar etiquetas a todos los puntos basados en el cluster más cercano
    for i in range(n_points):
        if labels[i] == -1:
            distances = [np.sum((data[i] - center) ** 2) for center in cluster_centers]
            labels[i] = np.argmin(distances)

    # Reconstruir las etiquetas reducidas en la forma de imagen
    labels_reducidos = labels.reshape(h, w)

    print ('clusters ',len(cluster_centers))
    # Escalar etiquetas a las dimensiones originales
    labels_escalados = resize(labels_reducidos, (a, b), order=0, preserve_range=True).astype(int)

    return labels_escalados
    '''