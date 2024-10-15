import React, { useState, useEffect } from 'react';
import DescriptorSelection from './DescriptorSelection';
import Modal from 'react-modal';

// Asegúrate de llamar a Modal.setAppElement en algún lugar para accesibilidad
Modal.setAppElement('#root');

const DefaultValuesManager = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [defaultValues, setDefaultValues] = useState({});
    const [descriptorList, setDescriptorList] = useState([]);
    const [selectedDescriptors, setSelectedDescriptors] = useState({});
    const [descriptorParams, setDescriptorParams] = useState({});

    useEffect(() => {
        fetch('http://localhost:5000/api/descriptors')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la red');
                }
                return response.json();
            })
            .then(data => {
                setDefaultValues(data.defaultValues);
                setDescriptorList(data.descriptorList);
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

        if (checked && defaultValues[name]) {
            setDescriptorParams((prev) => ({
                ...prev,
                [name]: defaultValues[name],
            }));
        } else if (!checked) {
            setDescriptorParams((prev) => {
                const { [name]: _, ...rest } = prev;
                return rest;
            });
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

    const handleSaveDefaultValues = () => {
        console.log('Datos enviados:', { defaultValues: descriptorParams, descriptorList });

        fetch('http://localhost:5000/api/descriptors', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ defaultValues: descriptorParams, descriptorList }),
        })
        .then(response => response.json())
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





