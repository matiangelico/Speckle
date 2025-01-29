//Commons
import PrimaryButton from "../../common/PrimaryButton";
import FileDropArea from "../Utils/FileDropArea";

//Icons
import ArrowRightIcon from "../../../assets/svg/icon-arrow-right.svg?react";

//Redux
import { initializeVideo } from "../../../reducers/trainingReducer";
import { useDispatch, useSelector } from 'react-redux';

const UploadVideo = ({ send }) => {
  const dispatch = useDispatch();
  const video = useSelector((state) => state.training.video);

  const handleNext = () => {
    if (video) {
      send({ type: "NEXT" });
    } else {
      alert("Por favor, sube un video antes de continuar.");
    }
  };

  const handleFileDrop = (file) => {
    dispatch(initializeVideo(file));
  };
  
  return (
    <>
      <div className='steps-container'>
        <h2>1. Subir video</h2>
        <h3>
          Explora y elige los archivos que deseas cargar desde tu computadora
        </h3>
      </div>

      <FileDropArea
        onFileDrop={handleFileDrop}
        fileName={video?.name || ""}
        fileSize={
          video ? (video.size / (1024 * 1024)).toFixed(2) : ""
        }
      />

      <div className='one-button-container'>
        <PrimaryButton
          handleClick={handleNext}
          RightSVG={ArrowRightIcon}
          text={"Seleccionar descriptores"}
        />
      </div>
    </>
  );
};

export default UploadVideo;
