from sklearn.mixture import GaussianMixture

def gm(tensor, m):
    m = int(m)
    a, b, c = tensor.shape
    features = tensor.reshape(-1, c)
    gmm = GaussianMixture(n_components=m, random_state=42)
    labels = gmm.fit_predict(features)

    labels +=1
    
    return labels.reshape(a, b), m
