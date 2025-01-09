import numpy as np

def sus (tensor, radius = 5):
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
            output_image[x, y] = combined_image[x, y] * (density[x, y] / max_density)
    
    return output_image