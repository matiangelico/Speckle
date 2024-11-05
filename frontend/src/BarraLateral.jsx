import React from 'react';
import '../styles/BarraLateral.css';
import LogoutButton from './LogoutButton';

const BarraLateral = () => {
    return (
        <div className="barra-lateral">
            <input
                type="text"
                placeholder="Buscar..."
                className="barra-busqueda"
            />
            <div className="historial-experiencias">
                <h2>Historial de Experiencias</h2>
                <ul>
                    <li>Experiencia 1</li>
                    <li>Experiencia 2</li>
                    <li>Experiencia 3</li>
                    {/* Agrega más elementos según sea necesario */}
                </ul>
            </div>
            <div className="botones">
                <button className="configuracion-boton">Configuración</button>
                <LogoutButton />
            </div>
        </div>
    );
};

export default BarraLateral;
