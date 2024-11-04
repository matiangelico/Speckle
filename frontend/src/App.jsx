import React from 'react';
import UploadVideo from './subirVideos.jsx';
import DefaultValuesManager from './DefaultValuesManager';
import BarraSuperior from './BarraSuperior.jsx';
import { useAuth0 } from '@auth0/auth0-react';

const App = () => {

    const {loginWithRedirect} = useAuth0()

    return (
        <div>
            <h1>Subir Video AVI</h1>
            <button onClick={() => loginWithRedirect()}>Login</button>
            <BarraSuperior/>
            <DefaultValuesManager />
            <UploadVideo />
        </div>
    );
};

export default App;


