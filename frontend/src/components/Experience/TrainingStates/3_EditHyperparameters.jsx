import { useState } from "react";
import styled from "styled-components";

//Redux
import { useDispatch } from "react-redux";
import {
  initializeDescriptorsResult,
  resetHyperparameters,
  updateHyperparameter,
} from "../../../reducers/trainingReducer";

//Commons
import Input from "../../common/Input";
import EmptyContainer from "../../common/EmptyContainer";
import PrimaryButton from "../../common/PrimaryButton";
import SecondaryButton from "../../common/SecondaryButton";
import Loader from "../../common/Loader";

//Icons
import ArrowRightIcon from "../../../assets/svg/icon-arrow-right.svg?react";
import ArrowLeftIcon from "../../../assets/svg/icon-arrow-left.svg?react";
import SlidersIcon from "../../../assets/svg/icon-sliders.svg?react";

//Utils
import { extractTextBetweenParentheses } from "../../../utils/stringUtils";
import Select from "../../common/Select";

//Hooks
import useToken from "../../../Hooks/useToken";

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
  const { token, loading: tokenLoading } = useToken();
  const [isLoading, setIsLoading] = useState(false);

  const chekedHyperparameters = chekedDescriptors.filter(
    (descriptor) => descriptor.hyperparameters.length > 0
  );

  const handleBack = () => {
    send({ type: "BACK" });
  };

  const handleNext = async () => {
    // Evita la acción si ya se está cargando o no hay token disponible
    if (!tokenLoading && token) {
      setIsLoading(true);
      try {
        await dispatch(initializeDescriptorsResult(token));
        // Aquí podrías agregar validaciones adicionales para los hiperparámetros
        if (chekedDescriptors.length !== 0) {
          send({ type: "NEXT" });
        }
      } catch (error) {
        console.error("Error al procesar la petición:", error);
      } finally {
        setIsLoading(false);
      }
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
      <div className="steps-container">
        <h2>3. Seleccionar hiperparámetros</h2>
        <h3>
          Si los descriptores seleccionados disponen de hiperparámetros
          ajustables, modifique sus valores para optimizar el análisis. En caso
          contrario, avance al siguiente paso. Use el botón “Restablecer
          valores” para volver a la configuración predeterminada en cualquier
          momento.
        </h3>
      </div>

      {isLoading && <Loader />}

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
                        placeholder="Seleccionar..."
                        value={param.value}
                        onChange={(newValue) =>
                          handleChangeValue(
                            descriptor.name,
                            param.paramName,
                            newValue
                          )
                        }
                        options={param.options}
                        error=""
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
            "Los descriptores seleccionados no poseen hiperparámetros editables."
          }
        />
      )}

      <div className="two-buttons-container">
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
        ) : null}

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
