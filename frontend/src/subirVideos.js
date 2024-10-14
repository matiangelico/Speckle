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
        
        // Si el descriptor es seleccionado, establecer valores por defecto
        if (checked && defaultValues[name]) {
            setDescriptorParams((prev) => ({
                ...prev,
                [name]: defaultValues[name],
            }));
        } else if (!checked) {
            // Reset parameters when descriptor is unchecked
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
            setImageUrls(Array.isArray(response.data.images) ? response.data.images : []);
        } catch (error) {
            console.error('Error uploading video:', error);
            setMessage('Ha ocurrido un error.');
        } finally {
            setLoading(false);
        }
    };

    const defaultValues = {
        'Diferencias Pesadas': { 'peso': '5' }, 
        'Fuzzy': { 'threshold': '120' },  
        'Wavelet Entropy': { 'wavelet':'db2','level': '5' },
        'High Low Ratio': { 'fs': '1.0' },
        'Filtro Bajo':{'fmin': '0.015' , 'fmax':'0.05', 'at_paso':'1', 'at_rechazo':'40', 'fs':'1.0'},
        'Filtro Medio':{'fmin': '0.05' , 'fmax':'0.25', 'at_paso':'1', 'at_rechazo':'40', 'fs':'1.0'},
        'Filtro Alto':{'fmin': '0.025' , 'fmax':'0.4', 'at_paso':'1', 'at_rechazo':'40', 'fs':'1.0'},
          
    };

    const descriptorList = [
        { name: 'Diferencias Pesadas', params: ['peso'] },
        { name: 'Diferencias Promediadas', params: [] },
        { name: 'Fujii', params: [] },
        { name: 'Desviacion Estandar', params: [] },
        { name: 'Contraste Temporal', params: [] },
        { name: 'Media', params: [] },
        { name: 'Autocorrelacion', params: [] },
        { name: 'Fuzzy', params: ['threshold'] },  // Ejemplo con parámetro "threshold"
        { name: 'Frecuencia Media', params: [] },
        { name: 'Entropia Shannon', params: [] },
        { name: 'Frecuencia Corte', params: [] },
        { name: 'Wavelet Entropy', params: ['wavelet','level'] },
        { name: 'High Low Ratio', params: ['fs'] },
        { name: 'Filtro Bajo', params: ['fmin','fmax','at_paso','at_rechazo','fs'] },
        { name: 'Filtro Medio', params: ['fmin','fmax','at_paso','at_rechazo','fs'] },
        { name: 'Filtro Alto', params: ['fmin','fmax','at_paso','at_rechazo','fs'] },
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
                                        value={descriptorParams[descriptor.name]?.[param] || ''} // Mostrar valor por defecto o vacío
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
            {imageUrls.length > 0 && imageUrls.map((image, index) => (
                <div key={index}>
                    <h5>{image.descriptor}</h5> {/* Título con el nombre del descriptor */}
                    <img src={`http://localhost:5000${image.url}`} alt={`Mapa de colores generado ${index}`} />
                    <a href={`http://localhost:5000${image.url}`} download>Descargar imagen de {image.descriptor}</a>
                </div>
            ))}


        </div>
    );
};

export default UploadVideo;



