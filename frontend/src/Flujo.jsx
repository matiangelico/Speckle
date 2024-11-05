import React from 'react';
import '../styles/Flujo.css'; // Asegúrate de crear un archivo CSS para estilos
import UploadVideo from './subirVideos';
import DefaultValuesManager from './DefaultValuesManager';

const Flujo = () => {
    return (
        <div className="flujo">
            <h2>Contenido Principal</h2>
            <p>Aquí va el contenido de la pantalla.</p>
            <DefaultValuesManager />
            <UploadVideo />
        </div>
    );
};

export default Flujo;
