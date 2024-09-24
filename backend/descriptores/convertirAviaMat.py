import cv2
import sys
import numpy as np
import matplotlib.pyplot as plt
import scipy.io as sio
from descriptores import diferenciasPesadas

def video_to_mat_grayscale(video_path, output_path):
    # Abrir el video
    cap = cv2.VideoCapture(video_path)
    
    # Obtener el número de frames, ancho y alto del video
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    
    # Crear una matriz para almacenar todos los frames en escala de grises
    video_data = np.empty((frame_count, frame_height, frame_width), dtype=np.uint8)
    
    frame_idx = 0
    
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        # Convertir el frame a escala de grises
        video_data[frame_idx] = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)  # Convertir a escala de grises
        frame_idx += 1
    
    cap.release()
    
    # Guardar la matriz en un archivo .mat
    sio.savemat(output_path, {'video_data': video_data})

# Cargar el archivo de video y guardar la salida
input_video_path = sys.argv[1]
output_mat_path = sys.argv[2]  # Salida para el archivo .mat
output_image_path = sys.argv[3]  # Salida para el archivo de imagen

# Convertir el video a una matriz y guardarlo
video_to_mat_grayscale(input_video_path, output_mat_path)

# Cargar el archivo .mat para aplicar el descriptor
data = sio.loadmat(output_mat_path)
tensor = np.array(data['video_data']).transpose(1, 2, 0)

# Aplicar el descriptor
difPesadas = diferenciasPesadas(tensor)

# Generar el mapa de colores a partir del tensor
plt.imshow(np.mean(difPesadas, axis=2), cmap='jet')  # Usa el colormap 'jet' para colores
plt.colorbar()

# Guardar la imagen en el formato correcto
plt.savefig(output_image_path)

print(f"Imagen guardada como: {output_image_path}")



