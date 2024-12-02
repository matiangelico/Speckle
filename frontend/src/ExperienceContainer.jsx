// import UploadVideo from "./subirVideos";
// import DefaultValuesManager from "./DefaultValuesManager";

import "../styles/Experience.css";
import FileDropArea from './FileDropArea';

const ExperienceContainer = () => {
  return (
    <main className='experience-container'>
      <div className='experience-header'>
        <h1>Contenido Principal</h1>
        <p>27 de octubre de 2024, 20:33 </p>
      </div>
      <div className='experience-content'>
        <div className='steps-container'>
          <h2>1. Subir video</h2>
          <h5>
            Explora y elige los archivos que deseas cargar desde tu computadora
          </h5>
        </div>
        {/* <DefaultValuesManager /> */}
        {/* <UploadVideo /> */}
        <FileDropArea />
      </div>
    </main>
  );
};

export default ExperienceContainer;
