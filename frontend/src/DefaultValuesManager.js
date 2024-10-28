import React, { useState, useEffect } from 'react';
import DescriptorSelection from './DescriptorSelection';
import Modal from 'react-modal';

// Asegúrate de llamar a Modal.setAppElement en algún lugar para accesibilidad
Modal.setAppElement('#root');

const DefaultValuesManager = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [descriptorList, setDescriptorList] = useState([]);
    const [selectedDescriptors, setSelectedDescriptors] = useState({});
    const [descriptorParams, setDescriptorParams] = useState({});

    useEffect(() => {
        fetch('http://localhost:5000/descriptor')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la red');
                }
                return response.json();
            })
            .then(data => {
                const initialSelectedDescriptors = {};
                const initialDescriptorParams = {};

                data.forEach(descriptor => {
                    initialSelectedDescriptors[descriptor.name] = false; // Todos descriptores deseleccionados inicialmente
                    initialDescriptorParams[descriptor.name] = descriptor.params; // Cargar los parámetros
                });

                setDescriptorList(data);
                setSelectedDescriptors(initialSelectedDescriptors);
                setDescriptorParams(initialDescriptorParams);
            })
            .catch(error => {
                console.error('Error al cargar los descriptores:', error);
            });
    }, []);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleDescriptorChange = (event) => {
        const { name, checked } = event.target;
        setSelectedDescriptors((prev) => ({
            ...prev,
            [name]: checked,
        }));

        if (checked) {
            // Si se selecciona un descriptor, se inicializan sus parámetros
            setDescriptorParams((prev) => ({
                ...prev,
                [name]: descriptorParams[name], // Cargar parámetros por defecto
            }));
        } else {
            // Si se deselecciona, eliminamos los parámetros de descriptor
            setDescriptorParams((prev) => {
                const { [name]: _, ...rest } = prev;
                return rest;
            });
        }
    };

    const handleParamChange = (descriptor, param, value) => {
        setDescriptorParams((prev) => ({
            ...prev,
            [descriptor]: prev[descriptor].map(p =>
                p.paramName === param ? { ...p, value } : p
            ),
        }));
    };

    const handleSaveDefaultValues = () => {
        
        // Convertir descriptorParams al formato esperado por el backend
        const body = descriptorList.map(descriptor => {
            const params = descriptorParams[descriptor.name] || []; // Obtener los parámetros del descriptor
            return {
                id: descriptor._id, // Asegúrate de que descriptor tenga un _id
                params: params.map(param => ({
                    paramName: param.paramName, // Usa paramName como clave
                    value: param.value || '' // Asegúrate de que haya un valor, aunque sea vacío
                }))
            };
        });
    
        fetch('http://localhost:5000/descriptor/update-default-values', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body), // Enviar el body modificado
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            console.log('Éxito:', data);
            toggleModal(); // Cierra el modal después de guardar
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };
    

    return (
        <div>
            <button onClick={toggleModal}>Actualizar valores por defecto</button>
            <Modal isOpen={isModalOpen} onRequestClose={toggleModal}>
                <h2>Modificar valores por defecto</h2>
                <DescriptorSelection 
                    descriptorList={descriptorList} 
                    selectedDescriptors={selectedDescriptors}
                    descriptorParams={descriptorParams}
                    onDescriptorChange={handleDescriptorChange} 
                    onParamChange={handleParamChange} 
                />
                <button onClick={handleSaveDefaultValues}>Guardar</button>
                <button onClick={toggleModal}>Cerrar</button>
            </Modal>
        </div>
    );
};

export default DefaultValuesManager;
