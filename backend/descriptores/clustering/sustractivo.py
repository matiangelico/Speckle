import numpy as np
from scipy.ndimage import gaussian_filter

'''def sus (tensor, radius):
    height, width, _ = tensor.shape
    
    # Promedio de las imágenes para obtener una representación inicial
    combined_image = np.mean(tensor, axis=2)
    
    # Crear una matriz de densidad
    density = np.zeros_like(combined_image)
    for x in range(height):
        for y in range(width):
            for i in range(-radius, radius + 1):
                for j in range(-radius, radius + 1):
                    if 0 <= x + i < height and 0 <= y + j < width:
                        diff = combined_image[x, y] - combined_image[x + i, y + j]
                        density[x, y] += np.exp(-diff**2 / (2 * radius**2))
    
    output_image = np.zeros_like(combined_image)
    max_density = np.max(density)
    for x in range(height):
        for y in range(width):
            output_image[x, y] = int(combined_image[x, y] * (density[x, y] / max_density))
    
    return output_image'''

def sus(tensor, radius):
    
    # Representación inicial como el promedio de las imágenes
    combined_image = np.mean(tensor, axis=2)

    # Aplicar un filtro gaussiano para calcular densidad (simula la dispersión del radio)
    density = gaussian_filter(combined_image, sigma=radius)

    # Normalizar densidad para evitar escalas arbitrarias
    density /= density.max()

    # Ajustar valores en la imagen de salida
    output_image = combined_image * density

    return output_image
