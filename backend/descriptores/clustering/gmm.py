from sklearn.mixture import GaussianMixture

def gmm (tensor, nro_clusters):

    a,b,_ = tensor.shape

    features = tensor.reshape(-1, tensor.shape[-1])

    gmm = GaussianMixture(n_components=nro_clusters, covariance_type='full', random_state=42)
    labels = gmm.fit_predict(features)

    # Reconstruir la imagen combinada
    return labels.reshape(a,b)