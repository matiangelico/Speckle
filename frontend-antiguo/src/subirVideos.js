import React, { useState } from 'react';
import axios from 'axios';
import DescriptorSelection from './DescriptorSelection'; // Asegúrate de que este sea el camino correcto

const UploadVideo = () => {
    const [defaultValues, setDefaultValues] = useState({});
    const [descriptorList, setDescriptorList] = useState([]);
    const [video, setVideo] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [imageUrls, setImageUrls] = useState([]);
    const [selectedDescriptors, setSelectedDescriptors] = useState({});
    const [descriptorsVisible, setDescriptorsVisible] = useState(false);
    const [descriptorParams, setDescriptorParams] = useState({});

    const handleFileChange = async (event) => {
        const selectedVideo = event.target.files[0];
        setVideo(selectedVideo);

        try {
            // Hacer la solicitud para obtener los descriptores solo después de seleccionar el video
            const response = await fetch('http://localhost:5000/descriptor');
            if (!response.ok) {
                throw new Error('Error en la red');
            }
            const data = await response.json();
            const transformedData = transformResponse(data);
            setDefaultValues(transformedData.defaultValues);
            setDescriptorList(transformedData.descriptorList);
            setDescriptorsVisible(true);  // Mostrar la lista de descriptores después de cargar los datos

            // Inicializar selectedDescriptors y descriptorParams
            const initialSelectedDescriptors = {};
            const initialDescriptorParams = {};

            transformedData.descriptorList.forEach(descriptor => {
                initialSelectedDescriptors[descriptor.name] = false; // Todos descriptores deseleccionados inicialmente
                initialDescriptorParams[descriptor.name] = transformedData.defaultValues[descriptor.name] || {}; // Cargar los valores por defecto
            });

            setSelectedDescriptors(initialSelectedDescriptors);
            setDescriptorParams(initialDescriptorParams);

        } catch (error) {
            console.error('Error al cargar los descriptores:', error);
            setMessage('Error al cargar los descriptores.');
        }
    };

    // Función para transformar la respuesta
    const transformResponse = (response) => {
        const result = {
            defaultValues: {},
            descriptorList: []
        };

        const firstItem = response[0]; // Asumiendo que solo hay un objeto en el arreglo
        result.defaultValues = firstItem.defaultValues;
        result.descriptorList = firstItem.descriptorList;

        return result;
    };

    const handleDescriptorChange = (event) => {
        const { name, checked } = event.target;
        setSelectedDescriptors((prev) => ({
            ...prev,
            [name]: checked,
        }));

        if (checked && defaultValues[name]) {
            setDescriptorParams((prev) => ({
                ...prev,
                [name]: defaultValues[name],
            }));
        } else if (!checked) {
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

        const descriptors = Object.keys(selectedDescriptors).filter(key => selectedDescriptors[key]);
        formData.append('descriptors', JSON.stringify(descriptors));
        formData.append('params', JSON.stringify(descriptorParams));

        setLoading(true);
        setMessage('');

        try {
            const response = await axios.post('http://localhost:5000/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setMessage(response.data.result);
            setImageUrls(Array.isArray(response.data.images) ? response.data.images : []);
        } catch (error) {
            setMessage('Ha ocurrido un error.');
        } finally {
            setLoading(false);
        }
    };

    const isAnyDescriptorSelected = Object.values(selectedDescriptors).some(checked => checked);

    return (
        <div>
            <input type="file" accept="video/avi" onChange={handleFileChange} />

            {descriptorsVisible && (
                <DescriptorSelection 
                    descriptorList={descriptorList} 
                    selectedDescriptors={selectedDescriptors}
                    descriptorParams={descriptorParams}
                    onDescriptorChange={handleDescriptorChange}
                    onParamChange={handleParamChange}
                />
            )}

            <button onClick={handleUpload} disabled={loading || !descriptorsVisible || !isAnyDescriptorSelected}>
                {loading ? 'Cargando...' : 'Enviar Descriptores'}
            </button>

            {message && <p>{message}</p>}
            {imageUrls.length > 0 && imageUrls.map((image, index) => (
                <div key={index}>
                    <h5>{image.descriptor}</h5>
                    <img src={`http://localhost:5000${image.url}`} alt={`Mapa de colores generado ${index}`} />
                    <a href={`http://localhost:5000${image.url}`} download>Descargar imagen de {image.descriptor}</a>
                </div>
            ))}
        </div>
    );
};

export default UploadVideo;







