import styled from "styled-components";

//Redux
import { useDispatch, useSelector } from "react-redux";
import { setDescriptors } from "../../../reducers/trainingReducer";

//Commons
import Input from "../../common/Input";
import PrimaryButton from "../../common/PrimaryButton";
import SecondaryButton from "../../common/SecondaryButton";

//Icons
import ArrowRightIcon from "../../../assets/svg/icon-arrow-right.svg?react";
import ArrowLeftIcon from "../../../assets/svg/icon-arrow-left.svg?react";

const HyperparametersContainer = styled.div`
  display: grid;
  gap: 10px 10px;
  width: 100%;
  height: min-content;
  max-height: 45vh;
  overflow-y: auto;
`;

const StyledRow = styled.div`
  display: flex;
  flex-direction: row;
  // flex-wrap: wrap;
  gap: 10px;

  input {
    margin-ottom: 0;
  }
`;

const EditHyperparameters = ({ send }) => {
  const dispatch = useDispatch();
  const descriptors = useSelector((state) => state.training.descriptors);

  const handleBack = () => {
    send({ type: "BACK" }); // Avanzar al siguiente estado si hay un video
  };

  const handleNext = () => {
    // if (context.descriptors) {
    //   send({ type: "NEXT" }); // Avanzar al siguiente estado si hay un video
    // } else {
    //   alert("Por favor, sube un video antes de continuar."); // Validación
    // }
    send({ type: "NEXT" }); // Avanzar al siguiente estado si hay un video
  };

  const setValue = () => {
    dispatch(setDescriptors(descriptors));
  };

  return (
    <>
      <div className='steps-container'>
        <h2>3. Seleccionar hiperparametros</h2>
        <h3>
          Explora y elige los archivos que deseas cargar desde tu computadora
        </h3>
      </div>

      <HyperparametersContainer>
        {descriptors
          .filter((descriptor) => descriptor.checked)
          .map(
            (descriptor, index) =>
              descriptor.hyperparameters?.length > 0 && (
                <StyledRow key={index}>
                  {descriptor.hyperparameters.map((param, paramIndex) => (
                    <Input
                      key={paramIndex}
                      primaryLabel={param.paramName}
                      secondaryLabel={descriptor.name}
                      type='text'
                      id={param.paramName}
                      name={param.paramName}
                      value={param.value}
                      setValue={setValue}
                    />
                  ))}
                </StyledRow>
              )
          )}
      </HyperparametersContainer>

      <div className='two-buttons-container'>
        <SecondaryButton
          handleClick={handleBack}
          SVG={ArrowLeftIcon}
          text={"Seleccionar descriptores"}
        />

        <PrimaryButton
          handleClick={handleNext}
          SVG={ArrowRightIcon}
          text={"Generar resultados"}
        />
      </div>
    </>
  );
};

export default EditHyperparameters;
