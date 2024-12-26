import PrimaryButton from "../common/PrimaryButton";
import FileDropArea from "./FileDropArea";

import ArrowRightIcon from "../../assets/svg/icon-arrow-right.svg?react";

const UploadVideo = ({ context, send }) => {
  // Manejar el clic del botón "Siguiente"
  const handleNext = () => {
    if (context.hyperparameters) {
      send({ type: "NEXT" }); // Avanzar al siguiente estado si hay un video
    } else {
      alert("Por favor, sube un video antes de continuar."); // Validación
    }
  };

  const handleFileDrop = (file) => {
    console.log("Archivo recibido:", file);
    console.log("Tipo MIME:", file.type);

    // Envía el archivo a la máquina de estados
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
