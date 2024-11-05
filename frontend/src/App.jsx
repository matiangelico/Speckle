import React from 'react';
import BarraSuperior from './BarraSuperior.jsx';
import BarraLateral from './BarraLateral';
import Flujo from './Flujo.jsx';
import { useAuth0 } from '@auth0/auth0-react';
import '../styles/App.css'

const App = () => {

    const {loginWithRedirect, isAuthenticated} = useAuth0()

    return (
        <div>
            {!isAuthenticated ? (
                <button onClick={() => loginWithRedirect()}>Login</button>
            ) : (
                <>
                    <div className="app-container">
                        <BarraSuperior />
                        <div className="main-content">
                            <BarraLateral />
                            <Flujo />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default App;


