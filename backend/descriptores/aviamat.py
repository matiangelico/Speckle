import cv2
import numpy as np
import scipy.io as sio
import tempfile

def videoamat(video):

    with tempfile.NamedTemporaryFile(delete=False, suffix=".avi") as temp_video:
        temp_video.write(video)
        temp_video_path = temp_video.name

    cap = cv2.VideoCapture(temp_video_path)
    
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    
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
    
    return  video_data