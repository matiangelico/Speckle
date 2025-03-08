//Commons
import PrimaryButton from "../../common/PrimaryButton";
import FileDropArea from "../Utils/FileDropArea";

//Icons
import ArrowRightIcon from "../../../assets/svg/icon-arrow-right.svg?react";

//Redux
import { useDispatch, useSelector } from "react-redux";
import { createNotification } from "../../../reducers/notificationReducer";
import { setVideo } from "../../../reducers/trainingReducer";

const UploadVideo = ({ send }) => {
  const dispatch = useDispatch();
  const video = useSelector((state) => state.training.video);

  const handleNext = () => {
    if (video) {
      send({ type: "NEXT" });
    } else {
      dispatch(
        createNotification("Por favor, sube un video antes de continuar.")
      );
    }
  };

  const handleFileDrop = (file) => {
    const validTypes = ["video/avi"]; // Tipo MIME para archivos .avi

    if (!validTypes.includes(file.type)) {
      dispatch(
        createNotification("Solo se permite cargar archivos .avi", "error")
      );
      return;
    }

    dispatch(setVideo(file));
  };

  return (
    <>
      <div className='steps-container'>
        <h2>1. Subir video</h2>
        <h3>
          Adjunte el archivo de video que servirá como entrada para el
          entrenamiento.
        </h3>
      </div>

      <FileDropArea
        onFileDrop={handleFileDrop}
        fileName={video?.name || ""}
        fileSize={video ? (video.size / (1024 * 1024)).toFixed(2) : ""}
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
