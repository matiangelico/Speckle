import { useState } from "react";

//Redux
import { useDispatch } from "react-redux";
import { createNotification } from "../../../reducers/notificationReducer";
import { getVideoData } from "../../../reducers/requestReducer";

//Commons
import SecondaryButton from "../../common/SecondaryButton";
import PrimaryButton from "../../common/PrimaryButton";
import FileDropArea from "../ExperienceUtils/FileDropArea";
import Loader from "../../common/Loader";

//Icons
import ArrowLeftIcon from "../../../assets/svg/icon-arrow-left.svg?react";
import ArrowRightIcon from "../../../assets/svg/icon-arrow-right.svg?react";

//Hooks
import useToken from "../../../Hooks/useToken";

const UploadVideo = ({ send, video }) => {
  const dispatch = useDispatch();
  const { token, loading: tokenLoading } = useToken();
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = () => {
    send({ type: "BACK" });
  };

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
        dispatch(createNotification(`${error.message}`, "error"));
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <div className='steps-container'>
          <Loader stepTitle='Analizando video' />
        </div>
      ) : (
        <>
          <div className='steps-container'>
            <h2>2. Subir nuevo video</h2>
            <h3>
              Adjunte el archivo de video que servirá como entrada para la
              consulta.
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

          <div className='two-buttons-container'>
            <SecondaryButton
              handleClick={handleBack}
              SVG={ArrowLeftIcon}
              text={"Seleccionar entrenamiento"}
            />

            <PrimaryButton
              handleClick={handleNext}
              RightSVG={ArrowRightIcon}
              text={"Descriptores utilizados"}
            />
          </div>
        </>
      )}
    </>
  );
};

export default UploadVideo;
