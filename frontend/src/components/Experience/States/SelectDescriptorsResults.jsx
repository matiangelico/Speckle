import PrimaryButton from "../../common/PrimaryButton";
import SecondaryButton from "../../common/SecondaryButton";

import ArrowRightIcon from "../../../assets/svg/icon-arrow-right.svg?react";
import ArrowLeftIcon from "../../../assets/svg/icon-arrow-left.svg?react";

const SelectDescriptorsResults = ({ context, send }) => {
  const handleBack = () => {
    if (context.descriptors) {
      send({ type: "BACK" }); // Avanzar al siguiente estado si hay un video
    } else {
      alert("Por favor, selecciona al menos un descriptor para continuar."); // Validación
    }
  };

  const handleNext = () => {
    if (context.descriptors) {
      send({ type: "NEXT" }); // Avanzar al siguiente estado si hay un video
    } else {
      alert("Por favor, sube un video antes de continuar."); // Validación
    }
  };

  console.log(context);

  return (
    <>
      <div className='steps-container'>
        <h2>4. Seleccionar resultados de descriptores</h2>
        <h3>
          Explora y elige los archivos que deseas cargar desde tu computadora
        </h3>
      </div>

      <div></div>

      <div className='two-buttons-container'>
        <SecondaryButton
          handleClick={handleBack}
          SVG={ArrowLeftIcon}
          text={"Seleccionar hiperparametros"}
        />

        <PrimaryButton
          handleClick={handleNext}
          SVG={ArrowRightIcon}
          text={"Editar parametros de clustering"}
        />
      </div>
    </>
  );
};

export default SelectDescriptorsResults;