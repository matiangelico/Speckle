import React from 'react';
import '../styles/ImageModal.css'; // Importa el archivo CSS para el modal

const ImageModal = ({ image, onClose }) => {
    if (!image) return null; // No renderiza nada si no hay imagen

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = `http://localhost:5000${image.url}`;
        link.download = `imagen-${image.descriptor}.jpg`;
        link.click();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <img
                    src={`http://localhost:5000${image.url}`}
                    alt="Imagen ampliada"
                    className="modal-image"
                />
                <button className="download-button" onClick={handleDownload}>
                    Descargar
                </button>
                <button className="close-button" onClick={onClose}>
                    Cerrar
                </button>
            </div>
        </div>
    );
};

export default ImageModal;
