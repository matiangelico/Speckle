import React, { useState } from 'react';
import axios from 'axios';
import Descriptor from './descriptor';

const UploadVideo = () => {
    const [video, setVideo] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [imageUrls, setImageUrls] = useState([]);
    const [selectedDescriptors, setSelectedDescriptors] = useState({});
    const [descriptorsVisible, setDescriptorsVisible] = useState(false);

    const handleFileChange = (event) => {
        setVideo(event.target.files[0]);
        setDescriptorsVisible(true);
    };

    const handleDescriptorChange = (event) => {
        const { name, checked } = event.target;
        setSelectedDescriptors((prev) => ({
            ...prev,
            [name]: checked,
        }));
    };

    const handleUpload = async () => {

        if (!video) {
            setMessage('Por favor, selecciona un video.');
            return;
        }

        const formData = new FormData();
        formData.append('video', video);

        // Agregar descriptores seleccionados al FormData
        const descriptors = Object.keys(selectedDescriptors).filter(key => selectedDescriptors[key]);
        formData.append('descriptors', JSON.stringify(descriptors));

        setLoading(true);
        setMessage('');


        try {
            const response = await axios.post('http://localhost:5000/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log(response.data);
            setMessage(response.data.result);
            setImageUrls(Array.isArray(response.data.imageUrls) ? response.data.imageUrls : []);
        } catch (error) {
            console.error('Error uploading video:', error);
            setMessage('Ha ocurrido un error.');
        } finally {
            setLoading(false); 
        }
    };

    const descriptorList = [
        'Diferencias Pesadas',
        'Diferencias Promediadas',
        'Fujii',
        'Desviacion Estandar',
        'Contraste Temporal',
        'Media',
        'Autocorrelacion',
        'Fuzzy',
        'Frecuencia Media',
        'Entropia Shannon 1',   
        'Frecuencia Corte',
        'Wavelet Entropy',
        'High Low Ratio',
        'Energia Filtrada',
        'Filtro Bajo',
        'Filtro Medio',
        'Filtro Alto',

    ];

    const isAnyDescriptorSelected = Object.values(selectedDescriptors).some(checked => checked);


    return (
        <div>
            <input type="file" accept="video/avi" onChange={handleFileChange} />
            {descriptorsVisible && (
                <div>
                    <h3>Selecciona los descriptores:</h3>
                    {descriptorList.map((descriptor, index) => (
                        <Descriptor 
                            key={index} 
                            name={descriptor} 
                            checked={selectedDescriptors[descriptor] || false} 
                            onChange={handleDescriptorChange} 
                        />
                    ))}
                </div>
            )}
            <button onClick={handleUpload} disabled={loading || !descriptorsVisible || !isAnyDescriptorSelected}>
                {loading ? 'Cargando...' : 'Enviar Descriptores'}
            </button>
            {message && <p>{message}</p>}
            {imageUrls.length > 0 && imageUrls.map((url, index) => (
                <div key={index}>
                    <img src={`http://localhost:5000${url}`} alt={`Mapa de colores generado ${index}`} />
                    <a href={`http://localhost:5000${url}`} download>Descargar imagen {index + 1}</a>
                </div>
))}

        </div>
    );
};

export default UploadVideo;
