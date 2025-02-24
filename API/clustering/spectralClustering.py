import numpy as np
from scipy.linalg import eigh
from sklearn.cluster import KMeans

def rbf_kernel(X, gamma=1.0):
    pairwise_sq_dists = np.sum((X[:, np.newaxis] - X[np.newaxis, :]) ** 2, axis=2)
    return np.exp(-gamma * pairwise_sq_dists)

def sc (tensor, nro_clusters):

    a,b,c = tensor.shape
    flattened_tensor = tensor.reshape(a*b,c)

    print('similarity_matrix')
    similarity_matrix = rbf_kernel(flattened_tensor, gamma=15.0)

    print('degree_matrix')
    degree_matrix = np.diag(similarity_matrix.sum(axis=1))

    print('Laplacian matrix') 
    laplacian_matrix = degree_matrix - similarity_matrix

    print('Compute the eigenvalues and eigenvectors')
    eigenvalues, eigenvectors = eigh(laplacian_matrix)

    print('Select the eigenvectors corresponding to the smallest k eigenvalues')
    selected_eigenvectors = eigenvectors[:, :nro_clusters]

    print('k-means')

    kmeans = KMeans(n_clusters=nro_clusters)
    kmeans.fit(selected_eigenvectors)
    
    labels = kmeans.labels_.reshape(a,b)
    print('labels shape',labels.shape)

    return labels, labels