//Commons
import PrimaryButton from "../../common/PrimaryButton";

//Icons
import ArrowRightIcon from "../../../assets/svg/icon-arrow-right.svg?react";

//Redux
import { useDispatch, useSelector } from "react-redux";
import { createNotification } from "../../../reducers/notificationReducer";
import EmptyContainer from '../../common/EmptyContainer';

const TrainingSelected = ({ send }) => {
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

  return (
    <>
      <div className='steps-container'>
        <h2>0. Seleccionar entrenamiento previo</h2>
        <h3>
          Adjunte el archivo de video que servirá como entrada para el
          entrenamiento.
        </h3>
      </div>

      <EmptyContainer message={"No has seleccionado ningun entrenamiento"}/>

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

export default TrainingSelected;
