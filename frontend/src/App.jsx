import React from 'react';
import UploadVideo from './subirVideos.jsx';
import DefaultValuesManager from './DefaultValuesManager';

const App = () => {
    return (
        <div>
            <h1>Subir Video AVI</h1>
            <DefaultValuesManager />
            <UploadVideo />
        </div>
    );
};

export default App;


