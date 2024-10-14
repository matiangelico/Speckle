import cv2
import sys
import numpy as np
import matplotlib.pyplot as plt
import scipy.io as sio
from descriptores import *


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


def apply_descriptor(tensor, descriptor, params=None):
    params = convert_params(params)
    #Aplica un descriptor sobre el tensor de video y devuelve el tensor resultante."""
    descriptor_functions = {
        "Diferencias Pesadas": diferenciasPesadas,
        "Diferencias Promediadas": diferenciasPromediadas,
        "Fujii": fujii,
        "Desviacion Estandar":desviacionEstandar,
        "Contraste Temporal":contrasteTemporal,
        "Media":media,
        "Autocorrelacion":autoCorrelacion,
        "Fuzzy":fuzzy,
        "Frecuencia Media":frecuenciaMedia,
        "Entropia Shannon":entropiaShannon,   
        "Frecuencia Corte":frecuenciaCorte,
        "Wavelet Entropy":waveletEntropy,
        "High Low Ratio":highLowRatio,
        "Filtro Bajo":filtroBajo,
        "Filtro Medio":filtroMedio,
        "Filtro Alto":filtroAlto
    }

    if descriptor in descriptor_functions:
        print(f"Aplicando descriptor: {descriptor}")
        return descriptor_functions[descriptor](tensor, **(params if params else {}))
    else:
        raise ValueError(f"Error: El descriptor '{descriptor}' no existe.")

def generate_color_map(tensor, output_image_path):
    # Visualiza directamente el tensor bidimensional
    plt.imshow(tensor, cmap='jet')
    plt.colorbar()
    plt.savefig(output_image_path)
    plt.close()  # Cierra el gráfico para evitar superposiciones en futuras ejecuciones
    print(f"Imagen guardada como: {output_image_path}")

def convert_params(params):
    for key, value in params.items():
        try:
            if 'peso' in key or 'level' in key or 'threshold' in key or 'at_paso' in key or 'at_rechazo' in key :
                # Convertir a int si el parámetro contiene 'peso' o 'cantidad'
                params[key] = int(value)
            elif 'wavelet' in key:
                params[key] = str(value)
            else:
                # Convertir a float en otros casos
                params[key] = float(value)
        except ValueError:
            # Si no se puede convertir, puedes decidir qué hacer (ejemplo: dar un valor por defecto)
            raise ValueError(f"El parámetro {key} con valor '{value}' no se pudo convertir a float.")
    return params




if __name__ == "__main__":
    input_video_path = sys.argv[1]
    output_mat_path = sys.argv[2]  # Salida para el archivo .mat
    output_image_path = sys.argv[3]  # Salida para el archivo de imagen
    descriptor = sys.argv[4]

    # Convertir el video a una matriz y guardarlo
    video_to_mat_grayscale(input_video_path, output_mat_path)

    # Cargar la matriz desde el archivo .mat
    data = sio.loadmat(output_mat_path)
    tensor = np.array(data['video_data']).transpose(1, 2, 0)
    setearDimensiones(tensor)

    params = {}
    if len(sys.argv) > 5:
        for param in sys.argv[5:]:
            key, value = param.split('=')
            if key == "threshold":
                params[key] = float(value)
            else:
                params[key] = value


    try:
        result_tensor = apply_descriptor(tensor, descriptor,params)
        generate_color_map(result_tensor, output_image_path)
    except ValueError as e:
        print(f"hola:{e}")
        sys.exit(1)




