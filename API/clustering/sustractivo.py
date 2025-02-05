import numpy as np
from skimage.transform import resize, downscale_local_mean
from scipy.spatial import cKDTree

def sus(tensor, radius):
    
    a, b, _ = tensor.shape

    tensor_reducido = downscale_local_mean(tensor, (2, 2, 1)).astype(np.float32)  # Forma: (a//2, b//2, c)

    h, w, d = tensor_reducido.shape
    data = tensor_reducido.reshape(-1, d)

    k = 1.5    # para ampliar o disminuir el radio de influencia de cada centro de cluster

    n_points = data.shape[0]
    potential = np.zeros(n_points)
    influence_radius = radius * k * np.sqrt(np.sum(np.var(data, axis=0)))

    tree = cKDTree(data)

    for i in range(n_points):
        diff = data - data[i]
        dist_squared = np.sum(diff ** 2, axis=1)
        potential[i] = np.sum(np.exp(-dist_squared / (influence_radius ** 2)))

    labels = np.full(n_points, -1, dtype=int)
    cluster_centers = []
    cluster_id = 0

    while np.max(potential) > 0:

        center_idx = np.argmax(potential)
        cluster_centers.append(data[center_idx])
        labels[center_idx] = cluster_id

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

    labels_escalados = resize(labels_reducidos, (a, b), order=0, preserve_range=True).astype(int)

    return labels_escalados
