import hdbscan
from sklearn.preprocessing import StandardScaler

def hello(tensor, nro_clusters):

    a,b,_ = tensor.shape

    features = tensor.reshape(-1, tensor.shape[-1])
    scaler = StandardScaler()
    scaled_features = scaler.fit_transform(features)

    db = hdbscan.HDBSCAN (min_cluster_size=30, min_samples=5)
    labels = db.fit_predict(scaled_features)

    return labels.reshape(a,b)
