import React, { useState } from 'react';
import axios from 'axios';

const UploadVideo = () => {
    console.log("Componente UploadVideo montado");
    const [video, setVideo] = useState(null);
    const [message, setMessage] = useState('');

    const handleFileChange = (event) => {
        console.log("Archivo seleccionado:", event.target.files[0]);
        setVideo(event.target.files[0]);
    };

    const handleUpload = async () => {
        console.log("llame a handleUpload");
        const formData = new FormData();
        formData.append('video', video);

        try {
            const response = await axios.post('http://localhost:5000/upload', formData);
            setMessage(response.data.result);
        } catch (error) {
            console.error('Error uploading video:', error);
            setMessage('Ha ocurrido un error.');
        }
    };


    return (
        <div>
            <input type="file" accept="video/avi" onChange={handleFileChange} />
            <button onClick={handleUpload}>Subir Video</button>
            {message && <p>{message}</p>} {}
        </div>
    );
};

export default UploadVideo;
