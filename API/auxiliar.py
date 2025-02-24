import json
import numpy as np
import matplotlib.pyplot as plt
import base64
from io import BytesIO
from PIL import Image

# Decodificar base64 y convertir a imagen
def decode_base64_image(base64_string):
    image_data = base64.b64decode(base64_string)
    image = Image.open(BytesIO(image_data))
    return np.array(image)

# Cargar el JSON con las imágenes
with open('./output/imagenes_clustering.json', 'r') as f:
    imagenes_json = json.load(f)

# Crear un solo plot para todas las imágenes
fig, axes = plt.subplots(1, 5, figsize=(15, 12))  # Ajusta 4x5 para 17 imágenes

# Aplanar los ejes para acceder fácilmente
axes = axes.ravel()

for i, imagen in enumerate(imagenes_json):
    nombre = imagen["nombre_clustering"] + str(imagen["nro_clusters"])
    imagen_base64 = imagen["imagen_clustering"]  # Aquí puedes decodificar la imagen base64 si es necesario
    imagen_array = decode_base64_image(imagen_base64)  # Decodificar la imagen base64
    
    axes[i].imshow(imagen_array, cmap='gray')  # Usar 'gray' si las imágenes están en escala de grises
    axes[i].set_title(nombre)
    axes[i].axis('off')  # Opcional: quita los ejes

# Ocultar los subgráficos no usados (si hay menos de 20 imágenes)
#for j in range(i + 1, 20):
#    axes[j].axis('off')

# Ajustar y mostrar el gráfico
plt.tight_layout()
plt.show()

'''

import numpy as np
import matplotlib.pyplot as plt
import json
import base64
from PIL import Image
from io import BytesIO


# Leer el archivo JSON
with open('./output/imagenes_clustering.json', 'r') as f:
    data = json.load(f)

# Extraer la cadena base64 de la clave 'prediccion'
imagen_base64 = data['imagen_clustering']

# Decodificar la cadena base64
imagen_bytes = base64.b64decode(imagen_base64)

# Convertir los bytes en una imagen
imagen = Image.open(BytesIO(imagen_bytes))

# Convertir la imagen a un arreglo de numpy
imagen_array = np.array(imagen)

# Mostrar la imagen usando matplotlib
plt.imshow(imagen_array)
plt.axis('off')  # Opcional: quitar los ejes
plt.show()

'''