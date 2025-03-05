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
import EmptyContainer from "../../common/EmptyContainer";
import PrimaryButton from "../../common/PrimaryButton";
import SecondaryButton from "../../common/SecondaryButton";

//Icons
import ArrowRightIcon from "../../../assets/svg/icon-arrow-right.svg?react";
import ArrowLeftIcon from "../../../assets/svg/icon-arrow-left.svg?react";
import SlidersIcon from "../../../assets/svg/icon-sliders.svg?react";

//Utils
import { extractTextBetweenParentheses } from "../../../utils/stringUtils";
import Select from "../../common/Select";

const HyperparametersContainer = styled.div`
  display: grid;
  gap: 10px;
  grid-auto-rows: min-content;
  width: 100%;

  /* Personaliza el ancho de la barra */
  &::-webkit-scrollbar {
    width: 0px;
    box-sizing: content-box;
  }

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
    margin-bottom: 0;
  }
`;

const EditHyperparameters = ({ send, chekedDescriptors }) => {
  const dispatch = useDispatch();
  const chekedHyperparameters = chekedDescriptors.filter(
    (descriptor) => descriptor.hyperparameters.length > 0
  );

  const handleBack = () => {
    send({ type: "BACK" });
  };

  const handleNext = () => {
    dispatch(initializeDescriptorsResult());

    if (chekedDescriptors.length !== 0) {
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
          Si los descriptores seleccionados disponen de hiperparámetros
          ajustables, modifique sus valores para optimizar el análisis. En caso
          contrario, avance al siguiente paso. Use el botón “Restablecer
          valores” para volver a la configuración predeterminada en cualquier
          momento.
        </h3>
      </div>

      {chekedHyperparameters.length > 0 ? (
        <HyperparametersContainer>
          {chekedDescriptors.map(
            (descriptor, index) =>
              descriptor.hyperparameters?.length > 0 && (
                <StyledRow key={index}>
                  {descriptor.hyperparameters.map((param, paramIndex) =>
                    param.type === "select" ? (
                      <Select
                        key={paramIndex}
                        primaryLabel={param.paramName}
                        secondaryLabel={`(${extractTextBetweenParentheses(
                          descriptor.name
                        )})`}
                        id={`${index}-${paramIndex}`}
                        name={param.paramName}
                        placeholder='Seleccionar...'
                        value={param.value}
                        onChange={(newValue) =>
                          handleChangeValue(
                            descriptor.name,
                            param.paramName,
                            newValue
                          )
                        }
                        options={param.options}
                        error=''
                        searchable={true}
                      />
                    ) : (
                      <Input
                        key={paramIndex}
                        primaryLabel={param.paramName}
                        secondaryLabel={`(${extractTextBetweenParentheses(
                          descriptor.name
                        )})`}
                        type={param.type ? param.type : "number"}
                        id={`${index}-${paramIndex}`}
                        name={param.paramName}
                        min={param.min ? param.min : 0}
                        max={param.max ? param.max : 10000}
                        step={param.step ? param.step : 0.01}
                        value={param.value}
                        setValue={(newValue) =>
                          handleChangeValue(
                            descriptor.name,
                            param.paramName,
                            newValue
                          )
                        }
                      />
                    )
                  )}
                </StyledRow>
              )
          )}
        </HyperparametersContainer>
      ) : (
        <EmptyContainer
          message={
            "Los descriptores seleccionados no poseen hiperparametros editables."
          }
        />
      )}

      <div className='two-buttons-container'>
        <SecondaryButton
          handleClick={handleBack}
          SVG={ArrowLeftIcon}
          text={"Seleccionar descriptores"}
        />

        {chekedHyperparameters.length > 0 ? (
          <SecondaryButton
            handleClick={handleSetDefaultValues}
            SVG={SlidersIcon}
            text={"Restablecer valores"}
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
