import { useState } from "react";
import ImageModal from "./ImageModal"; // Asegúrate de tener este componente separado
//import "../styles/ImageDisplay.css"; // Importa el archivo CSS

const ImageDisplay = ({ imageUrls, onApplyAI }) => {
  const [selectedImages, setSelectedImages] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

  // Maneja la selección o deselección de las imágenes
  const handleImageSelect = (index) => {
    setSelectedImages((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Abre el modal con la imagen seleccionada
  const handleImageClick = (image) => {
    setCurrentImage(image);
    setShowModal(true);
  };

  // Cierra el modal
  const handleCloseModal = () => setShowModal(false);

  // Verifica si al menos una imagen ha sido seleccionada
  const isAnyImageSelected = Object.values(selectedImages).some(
    (selected) => selected
  );

  // Llama a la función onApplyAI con las imágenes seleccionadas
  const handleApplyAI = () => {
    const selectedImageUrls = imageUrls.filter(
      (_, index) => selectedImages[index]
    );
    onApplyAI(selectedImageUrls);
  };

  if (imageUrls.length === 0) return null;

  return (
    <div>
      <div className='image-display-container'>
        {imageUrls.map((image, index) => (
          <div className='image-item' key={index}>
            <div className='checkbox-container'>
              <input
                type='checkbox'
                checked={!!selectedImages[index]}
                onChange={() => handleImageSelect(index)}
              />
              <label>{image.descriptor}</label>
            </div>
            <img
              src={`http://localhost:5000${image.url}`}
              alt={`Mapa de colores generado ${index}`}
              onClick={() => handleImageClick(image)}
              className='image-with-border'
            />
          </div>
        ))}
      </div>

      {isAnyImageSelected && (
        <button className='apply-ai-button' onClick={handleApplyAI}>
          Aplicar IA
        </button>
      )}

      {showModal && (
        <ImageModal image={currentImage} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default ImageDisplay;
