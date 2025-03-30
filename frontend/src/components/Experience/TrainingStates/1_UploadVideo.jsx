import { useState } from "react";

//Redux
import { useDispatch } from "react-redux";
import { createNotification } from "../../../reducers/notificationReducer";
import { getVideoData } from "../../../reducers/trainingReducer";

//Commons
import PrimaryButton from "../../common/PrimaryButton";
import Loader from "../../common/Loader";

//Utils
import FileDropArea from "../ExperienceUtils/FileDropArea";

//Icons
import ArrowRightIcon from "../../../assets/svg/icon-arrow-right.svg?react";

//Hooks
import useToken from "../../../Hooks/useToken";

const UploadVideo = ({ send, video }) => {
  const dispatch = useDispatch();
  const { token, loading: tokenLoading } = useToken();
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = () => {
    if (video) {
      send({ type: "NEXT" });
    } else {
      dispatch(
        createNotification("Por favor, sube un video antes de continuar.")
      );
    }
  };

  const handleFileDrop = async (file) => {
    const validTypes = ["video/avi"]; // Tipo MIME para archivos .avi

    if (!validTypes.includes(file.type)) {
      dispatch(
        createNotification("Solo se permite cargar archivos .avi", "error")
      );
      return;
    }

    if (!tokenLoading && token) {
      setIsLoading(true);
      try {
        await dispatch(getVideoData(token, file));

        dispatch(createNotification(`Video subido correctamente.`, "success"));
      } catch (error) {
        console.error("Error al procesar la petición:", error);

        dispatch(
          createNotification(
            `Ha ocurrido un error intentando procesar el video, vuelve a intentarlo mas tarde.`,
            "error"
          )
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <div className='steps-container'>
          <Loader />
        </div>
      ) : (
        <>
          <div className='steps-container'>
            <h2>1. Subir video</h2>
            <h3>
              Adjunte el archivo de video que servirá como entrada para el
              entrenamiento.
            </h3>
          </div>

          <FileDropArea
            message={
              "Arrastra y suelta un archivo de video (.avi) o haz clic para seleccionar uno desde tu computadora."
            }
            onFileDrop={handleFileDrop}
            fileName={video?.file.name || ""}
            fileSize={video ? (video.file.size / (1024 * 1024)).toFixed(2) : ""}
            videoWidth={video?.width}
            videoHeight={video?.height}
            videoFrames={video?.frames}
          />

          <div className='one-button-container'>
            <PrimaryButton
              handleClick={handleNext}
              RightSVG={ArrowRightIcon}
              text={"Seleccionar descriptores"}
            />
          </div>
        </>
      )}
    </>
  );
};

export default UploadVideo;
