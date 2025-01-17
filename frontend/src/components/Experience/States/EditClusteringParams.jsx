import PrimaryButton from "../../common/PrimaryButton";
import SecondaryButton from "../../common/SecondaryButton";

import ArrowRightIcon from "../../../assets/svg/icon-arrow-right.svg?react";
import ArrowLeftIcon from "../../../assets/svg/icon-arrow-left.svg?react";

const EditClusteringParams = ({ send }) => {
  const handleBack = () => {
    send({ type: "BACK" }); // Avanzar al siguiente estado si hay un video
  };

  const handleNext = () => {
    send({ type: "NEXT" }); // Avanzar al siguiente estado si hay un video}
  };

  return (
    <>
      <div className='steps-container'>
        <h2>5. Editar parametros de clustering</h2>
        <h3>
          Explora y elige los archivos que deseas cargar desde tu computadora
        </h3>
      </div>

      <div></div>

      <div className='two-buttons-container'>
        <SecondaryButton
          handleClick={handleBack}
          SVG={ArrowLeftIcon}
          text={"Seleccionar resultados de descriptores"}
        />

        <PrimaryButton
          handleClick={handleNext}
          SVG={ArrowRightIcon}
          text={"Generar resultados de clustering"}
        />
      </div>
    </>
  );
};

export default EditClusteringParams;
