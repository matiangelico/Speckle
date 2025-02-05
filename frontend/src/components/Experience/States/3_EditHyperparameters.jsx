import styled from "styled-components";

//Redux
import { useDispatch } from "react-redux";
import {
  initializeDescriptorsResult,
  resetHyperparameters,
  updateHyperparameter,
} from "../../../reducers/trainingReducer";
// import { showLoader, hideLoader } from '../store/loaderReducer';

//Commons
import Input from "../../common/Input";
import EmptyContainer from '../../common/EmptyContainer';
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
  // padding-bottom: 10px;
  height: min-content;
  // max-height: 45vh;
  overflow-y: auto;

  @media (min-height: 900px) {
    // max-height: 60vh;
    gap: 20px;
  }
`;

const StyledRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;

  input {
    margin-ottom: 0;
  }
`;

const EditHyperparameters = ({ send, chekedDescriptors }) => {
  const dispatch = useDispatch();

  const handleBack = () => {
    send({ type: "BACK" });
  };

  const handleNext = () => {
    dispatch(initializeDescriptorsResult())

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
    dispatch(resetHyperparameters());
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
        <EmptyContainer message={"Los descriptores seleccionados no poseen hiperparametros editables."} />
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
            text={"Reestablecer valores"}
          />
        ) : (
          <></>
        )}

        <PrimaryButton
          handleClick={handleNext}
          RightSVG={ArrowRightIcon}
          text={"Generar resultados"}
        />
      </div>
    </>
  );
};

export default EditHyperparameters;
