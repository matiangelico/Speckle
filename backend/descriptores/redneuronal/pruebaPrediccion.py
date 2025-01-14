import numpy as np
import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
from tensorflow import keras
from tensorflow import metrics
import matplotlib.pyplot as plt
import scipy.io as sio
from descriptores import fujii, desviacionEstandar, frecuenciaMedia

#entrenamiento con Shannon, adri, fuzzy

data = sio.loadmat('matrizMoneda10.mat')
m = np.array(data['video_data']).transpose(1,2,0)

m1 = fujii(m)
m2 = frecuenciaMedia(m)
m3 = desviacionEstandar(m)

matrices = [m1,m2,m3]

tensor = np.stack(matrices, axis=-1) 

entrada = tensor.reshape(-1,3)

# Para cargar y usar el modelo en el futuro:
modelo_cargado = keras.models.load_model("modelo_recibido1234.h5", custom_objects={'mse': metrics.MeanSquaredError()})
                                         
# Hacer una predicción con nuevos datos
prediccion = modelo_cargado.predict(entrada)

salida = prediccion.reshape(300,300)

plt.imshow(salida, cmap='jet') 
plt.colorbar()
plt.title("prediccion")
plt.show()

