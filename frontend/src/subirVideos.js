import React, { useState } from 'react';
import axios from 'axios';

const UploadVideo = () => {
    const [video, setVideo] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    const handleFileChange = (event) => {
        setVideo(event.target.files[0]);
    };

    const handleUpload = async () => {

        const formData = new FormData();
        formData.append('video', video);

        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/upload', formData);
            setMessage(response.data.result);
            setImageUrl(response.data.imageUrl);
        } catch (error) {
            console.error('Error uploading video:', error);
            setMessage('Ha ocurrido un error.');
        } finally {
            setLoading(false); 
        }
    };


    return (
        <div>
            <input type="file" accept="video/avi" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={loading}>{loading ? 'Cargando...' : 'Subir Video'}</button>
            {message && <p>{message}</p>}
            {imageUrl && (
                <div>
                    <img src={`http://localhost:5000${imageUrl}`} alt="Mapa de colores generado" />
                    <a href={`http://localhost:5000${imageUrl}`} download>Descargar imagen</a>
                </div>
            )}
        </div>
    );
};

export default UploadVideo;
