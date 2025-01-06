import styled from "styled-components";

//Redux
import { useDispatch, useSelector } from "react-redux";
import { resetHyperparameters, updateHyperparameter } from "../../../reducers/trainingReducer";

//Commons
import Input from "../../common/Input";
import PrimaryButton from "../../common/PrimaryButton";
import SecondaryButton from "../../common/SecondaryButton";

//Icons
import ArrowRightIcon from "../../../assets/svg/icon-arrow-right.svg?react";
import ArrowLeftIcon from "../../../assets/svg/icon-arrow-left.svg?react";
import SlidersIcon from "../../../assets/svg/icon-sliders.svg?react";

const HyperparametersContainer = styled.div`
  display: grid;
  gap: 10px 10px;
  width: 100%;
  padding-bottom: 10px;
  height: min-content;
  max-height: 45vh;
  overflow-y: auto;
`;

const StyledRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;

  input {
    margin-ottom: 0;
  }
`;

const EmptyContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  pointer-events: none;

  border-radius: 8px;
  border: 2px dashed var(--dark-300, #cbd2e0);
  background: var(--white, #fff);

  span {
    color: var(--dark-400, #a0abc0);
    text-align: center;
    font-feature-settings: "calt" off;

    font-family: Inter;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
    letter-spacing: -0.16px;
  }
`;

const EditHyperparameters = ({ send }) => {
  const dispatch = useDispatch();
  const descriptors = useSelector((state) => state.training.descriptors);
  const chekedDescriptors = descriptors.filter(
    (descriptor) => descriptor.checked && descriptor.hyperparameters.length > 0
  );

  const handleBack = () => {
    send({ type: "BACK" });
  };

  const handleNext = () => {
    if (chekedDescriptors.length === 0) {
      send({ type: "NEXT" });
    } else {
      // ALGUNA VALIDACION DE HIPERPARAMETROS?
      send({ type: "NEXT" });
    }
  };

  const handleChangeValue = (descriptorName, hyperparameterName, newValue) => {
    dispatch(
      updateHyperparameter({
        descriptorName: descriptorName,
        hyperparameterName: hyperparameterName,
        newValue: newValue,
      })
    );
  };

  const handleSetDefaultValues = () => {
    dispatch(resetHyperparameters())
  };

  return (
    <>
      <div className='steps-container'>
        <h2>3. Seleccionar hiperparametros</h2>
        <h3>
          Explora y elige los archivos que deseas cargar desde tu computadora
        </h3>
      </div>

      {chekedDescriptors.length > 0 ? (
        <HyperparametersContainer>
          {chekedDescriptors.map(
            (descriptor, index) =>
              descriptor.hyperparameters?.length > 0 && (
                <StyledRow key={index}>
                  {descriptor.hyperparameters.map((param, paramIndex) => (
                    <Input
                      key={paramIndex}
                      primaryLabel={param.paramName}
                      secondaryLabel={descriptor.name}
                      type='number'
                      id={param.paramName}
                      name={param.paramName}
                      value={param.value}
                      setValue={(newValue) =>
                        handleChangeValue(
                          descriptor.name,
                          param.paramName,
                          newValue
                        )
                      }
                    />
                  ))}
                </StyledRow>
              )
          )}
        </HyperparametersContainer>
      ) : (
        <EmptyContainer>
          <span>
            Los descriptores seleccionados no poseen hiperparametros editables.
          </span>
        </EmptyContainer>
      )}

      <div className='two-buttons-container'>
        <SecondaryButton
          handleClick={handleBack}
          SVG={ArrowLeftIcon}
          text={"Seleccionar descriptores"}
        />

        {chekedDescriptors.length > 0 ? (
          <SecondaryButton
            handleClick={handleSetDefaultValues}
            SVG={SlidersIcon}
            text={"Reestablecer valores predeterminados"}
          />
        ) : (
          <></>
        )}

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
