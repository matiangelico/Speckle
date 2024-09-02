import cv2
import numpy as np
import scipy.io as sio

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
        # Guardar el frame en la matriz (sin conversión)
        video_data[frame_idx] = frame[:, :, 0]  # Seleccionamos un solo canal, ya que el video está en escala de grises
        frame_idx += 1
    
    cap.release()
    
    # Guardar la matriz en un archivo .mat
    sio.savemat(output_path, {'video_data': video_data})

# Ejemplo de uso
video_to_mat_grayscale('moneda10.avi', 'matrizMoneda10.mat')

