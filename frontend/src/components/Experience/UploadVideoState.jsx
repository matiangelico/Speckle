import PrimaryButton from '../common/PrimaryButton';
import FileDropArea from './FileDropArea';

import ArrowRightIcon from '../../assets/svg/icon-arrow-right.svg?react';

const UploadVideo = ({ onNext }) => {


  return (
    <>
      <div className='steps-container'>
        <h2>1. Subir video</h2>
        <h3>
          Explora y elige los archivos que deseas cargar desde tu computadora
        </h3>
      </div>
      {/* <DefaultValuesManager/> */}
      {/* <UploadVideo /> */}
      <FileDropArea />
      <PrimaryButton handleClick={onNext} SVG={ArrowRightIcon} text={"Seleccionar descriptores"} />
    </>
  );
};

export default UploadVideo;
