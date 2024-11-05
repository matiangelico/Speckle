import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import '../styles/Navbar.css';
import logo from '../logoSpeckle.png';

const BarraSuperior = () =>{
    const {user, isAuthenticated} = useAuth0();
    return (
        isAuthenticated && (
            <div className="navbar">
                <div className="logo-container">
                    <img className="logo-image" src={logo} alt="Logo" /> {/* Añade la imagen aquí */}
                </div>
                <div className="user-info">
                    <div className="user-details">
                        <strong className="user-name">{user.name}</strong>
                        <p className="user-email">{user.email}</p>
                    </div>
                    <img className="profile-image" src={user.picture} alt={user.name} />
                </div>
            </div>
        )
    );
};

export default BarraSuperior;