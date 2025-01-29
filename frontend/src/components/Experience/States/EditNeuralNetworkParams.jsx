import PrimaryButton from "../../common/PrimaryButton";
import SecondaryButton from "../../common/SecondaryButton";

import ArrowRightIcon from "../../../assets/svg/icon-arrow-right.svg?react";
import ArrowLeftIcon from "../../../assets/svg/icon-arrow-left.svg?react";

const EditNeuralNetworkParams = ({ send }) => {
  const handleBack = () => {
    send({ type: "BACK" });
  };

  const handleNext = () => {
    send({ type: "NEXT" });
  };

  return (
    <>
      <div className='steps-container'>
        <h2>7. Editar parametros de la red neuronal</h2>
        <h3>
          Explora y elige los archivos que deseas cargar desde tu computadora
        </h3>
      </div>

      <div></div>

      <div className='two-buttons-container'>
        <SecondaryButton
          handleClick={handleBack}
          SVG={ArrowLeftIcon}
          text={"Seleccionar resultados de clustering"}
        />

        <PrimaryButton
          handleClick={handleNext}
          RightSVG={ArrowRightIcon}
          text={"Entrenar red neuronal"}
        />
      </div>
    </>
  );
};

export default EditNeuralNetworkParams;