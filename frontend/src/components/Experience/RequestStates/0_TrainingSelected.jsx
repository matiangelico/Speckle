//Commons
import PrimaryButton from "../../common/PrimaryButton";

//Icons
import ArrowRightIcon from "../../../assets/svg/icon-arrow-right.svg?react";

//Redux
import { useDispatch } from "react-redux";
import { createNotification } from "../../../reducers/notificationReducer";

//Utils
import FileInfoContainer from "../ExperienceUtils/FileInfoContainer";

const TrainingSelected = ({ send, video }) => {
  const dispatch = useDispatch();

  const handleNext = () => {
    if (video) {
      send({ type: "NEXT" });
    } else {
      dispatch(
        createNotification(
          "Por favor, selecciona un entrenamiento de la barra lateral antes de continuar."
        )
      );
    }
  };

  return (
    <>
      <div className='steps-container'>
        <h2>0. Seleccionar entrenamiento</h2>
        <h3>
          A continuación se muestran los detalles del video con el cual fue
          entrenada la red neuronal.
        </h3>
      </div>

      <FileInfoContainer
        fileName={video?.name || ""}
        videoWidth={video?.width}
        videoHeight={video?.height}
        videoFrames={video?.frames}
      />

      <div className='one-button-container'>
        <PrimaryButton
          handleClick={handleNext}
          RightSVG={ArrowRightIcon}
          text={"Subir nuevo video"}
        />
      </div>
    </>
  );
};

export default TrainingSelected;
