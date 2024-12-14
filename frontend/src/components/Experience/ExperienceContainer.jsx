//import UploadVideo from "./subirVideos";
//import DefaultValuesManager from "./DefaultValuesManager";

import "../../../styles/Experience.css";

import FileDropArea from './FileDropArea';
import SecondaryButton from '../common/SecondaryButton';
import PrimaryButton from '../common/PrimaryButton';

import NewExperienceIcon from '../../assets/svg/icon-lus-circle.svg?react';
import ArrowRightIcon from '../../assets/svg/icon-arrow-right.svg?react';

const ExperienceContainer = () => {

  return (
    <main className='experience-container'>
      <div className='experience-header'>
        <h1>Contenido Principal</h1>
        <p>27 de octubre de 2024, 20:33 </p>
        <SecondaryButton SVG={NewExperienceIcon} text={"Nueva experiencia"}/>
      </div>
      <div className='experience-content'>
        <div className='steps-container'>
          <h2>1. Subir video</h2>
          <h3>
            Explora y elige los archivos que deseas cargar desde tu computadora
          </h3>
        </div>
        {/* <DefaultValuesManager/> */}
        {/* <UploadVideo /> */}
        <FileDropArea />
        <PrimaryButton SVG={ArrowRightIcon} text={"Seleccionar descriptores"} />
      </div>
    </main>
  );
};

export default ExperienceContainer;
