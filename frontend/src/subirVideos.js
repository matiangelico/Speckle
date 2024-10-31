import React, { useState } from 'react'; 
import axios from 'axios';
import DescriptorSelection from './DescriptorSelection'; // Asegúrate de que este sea el camino correcto

const UploadVideo = () => {
    const [defaultValues, setDefaultValues] = useState([]);
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
            const response = await fetch('http://localhost:5000/descriptor');
            if (!response.ok) {
                throw new Error('Error en la red');
            }
            const data = await response.json();
            const transformedData = transformResponse(data);
            setDefaultValues(transformedData.defaultValues);
            setDescriptorList(transformedData.descriptorList);
            setDescriptorsVisible(true);  // Mostrar la lista de descriptores después de cargar los datos

            const initialSelectedDescriptors = {};
            const initialDescriptorParams = {};

            transformedData.descriptorList.forEach(descriptor => {
                initialSelectedDescriptors[descriptor.name] = false; // Todos descriptores deseleccionados inicialmente
                initialDescriptorParams[descriptor.name] = descriptor.params.reduce((acc, param) => {
                    acc[param.paramName] = param.value; // Cargar los valores por defecto
                    return acc;
                }, {});
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

        response.forEach(item => {
            // Se mantiene el _id en el nuevo formato
            const paramsArray = item.params.map(param => ({
                paramName: param.paramName,
                value: param.value
            }));

            result.descriptorList.push({
                _id: item._id, // Agrega el _id aquí
                name: item.name,
                params: paramsArray
            });

            // Guardar los valores por defecto en un formato plano
            result.defaultValues[item.name] = item.params;
        });

        return result;
    };

    const handleDescriptorChange = (event) => {
        const { name, checked } = event.target;
        setSelectedDescriptors((prev) => ({
            ...prev,
            [name]: checked,
        }));

        if (checked) {
            setDescriptorParams((prev) => ({
                ...prev,
                [name]: descriptorParams[name] || {}, // Mantener los parámetros existentes
            }));
        } else {
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
        console.log("Los descriptores son", descriptors);
        console.log("Los parámetros son", descriptorParams)

        setLoading(true);
        setMessage('');

        try {
            const response = await axios.post('http://localhost:5000/uploadVideo', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log("La respuesta es", response.data);
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
