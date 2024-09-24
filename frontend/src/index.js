import React from 'react';
import ReactDOM from 'react-dom/client'; // Importa desde 'react-dom/client'
import App from './app'; // Importa tu componente principal

// Crea un root para renderizar
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderiza tu aplicación
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

