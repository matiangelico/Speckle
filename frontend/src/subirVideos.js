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
    const [descriptorParams, setDescriptorParams] = useState({});

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
        // Reset parameters when descriptor is unchecked
        if (!checked) {
            setDescriptorParams((prev) => ({
                ...prev,
                [name]: {},
            }));
        }
    };

    const handleParamChange = (descriptor, param, value) => {
        setDescriptorParams((prev) => ({
            ...prev,
            [descriptor]: {
                ...prev[descriptor],
                [param]: value,
            },
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
        formData.append('params', JSON.stringify(descriptorParams));

        setLoading(true);
        setMessage('');

        try {
            console.log("Se envío el descriptor: " + JSON.stringify(descriptors) + " con los parámetros: " + JSON.stringify(descriptorParams));
        
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
        { name: 'Diferencias Pesadas', params: [] },
        { name: 'Diferencias Promediadas', params: [] },
        { name: 'Fujii', params: [] },
        { name: 'Contraste Temporal', params: [] },
        { name: 'Media', params: [] },
        { name: 'Autocorrelacion', params: [] },
        { name: 'Fuzzy', params: ['threshold'] },
        { name: 'Frecuencia Media', params: [] },
        { name: 'Entropia Shannon 1', params: [] },
        { name: 'Frecuencia Corte', params: [] },
        { name: 'Wavelet Entropy', params: [] },
        { name: 'High Low Ratio', params: [] },
        { name: 'Filtro Bajo', params: [] },
        { name: 'Filtro Medio', params: [] },
        { name: 'Filtro Alto', params: [] },
    ];

    const isAnyDescriptorSelected = Object.values(selectedDescriptors).some(checked => checked);

    return (
        <div>
            <input type="file" accept="video/avi" onChange={handleFileChange} />
            {descriptorsVisible && descriptorList.map((descriptor, index) => (
                <div key={index}>
                    <Descriptor 
                        name={descriptor.name} 
                        checked={selectedDescriptors[descriptor.name] || false} 
                        onChange={handleDescriptorChange} 
                    />
                    {selectedDescriptors[descriptor.name] && descriptor.params && descriptor.params.length > 0 && (
                        <div>
                            {descriptor.params.map((param, i) => (
                                <div key={i}>
                                    <label>{param}:</label>
                                    <input 
                                        type="text" 
                                        onChange={(e) => handleParamChange(descriptor.name, param, e.target.value)} 
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
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


