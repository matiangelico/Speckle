import PrimaryButton from "../../common/PrimaryButton";
import FileDropArea from "../Utils/FileDropArea";

import ArrowRightIcon from "../../../assets/svg/icon-arrow-right.svg?react";

const UploadVideo = ({ context, send }) => {
  const handleNext = () => {
    if (context.video) {
      send({ type: "NEXT" });
    } else {
      alert("Por favor, sube un video antes de continuar.");
    }
  };

  const handleFileDrop = (file) => {
    send({ type: "UPDATE_CONTEXT", data: { video: file } });
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
        fileName={context.video?.name || ""}
        fileSize={
          context.video ? (context.video.size / (1024 * 1024)).toFixed(2) : ""
        }
      />

      <div className='one-button-container'>
        <PrimaryButton
          handleClick={handleNext}
          SVG={ArrowRightIcon}
          text={"Seleccionar descriptores"}
        />
      </div>
    </>
  );
};

export default UploadVideo;
