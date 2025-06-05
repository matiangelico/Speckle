import styled from "styled-components";

import { useState } from "react";

//Redux
import { useDispatch } from "react-redux";
import {
  initializeDescriptorsResult,
  resetHyperparameters,
  updateHyperparameter,
} from "../../../reducers/trainingReducer";
import { showConfirmationAlertAsync } from "../../../reducers/alertReducer";
import { createNotification } from "../../../reducers/notificationReducer";

//Commons
import Input from "../../common/Input";
import EmptyContainer from "../../common/EmptyContainer";
import PrimaryButton from "../../common/PrimaryButton";
import SecondaryButton from "../../common/SecondaryButton";
import Loader from "../../common/Loader";
import Select from "../../common/Select";

//Icons
import ArrowRightIcon from "../../../assets/svg/icon-arrow-right.svg?react";
import ArrowLeftIcon from "../../../assets/svg/icon-arrow-left.svg?react";
import SlidersIcon from "../../../assets/svg/icon-sliders.svg?react";

//Utils
import { extractTextBetweenParentheses } from "../../../utils/stringUtils";

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

const EditHyperparameters = ({
  send,
  chekedDescriptors,
  videoFrames,
  descriptorsResults,
}) => {
  const dispatch = useDispatch();
  const { token, loading: tokenLoading } = useToken();
  const [isLoading, setIsLoading] = useState(false);

  const chekedHyperparameters = chekedDescriptors.filter(
    (descriptor) => descriptor.hyperparameters.length > 0
  );

  const areHyperparamsValid = () => {
    const log2 = (num) => {
      if (num <= 0) {
        throw new Error("El número debe ser mayor a cero");
      }
      return Math.log2 ? Math.log2(num) : Math.log(num) / Math.log(2);
    };

    for (const descriptor of chekedDescriptors) {
      const hyperparameters = descriptor.hyperparameters;

      switch (descriptor.id) {
        case "wgd": {
          const [weight] = hyperparameters;
          if (
            !(
              1 < parseFloat(weight.value) &&
              parseFloat(weight.value) < videoFrames
            )
          ) {
            return {
              isValid: false,
              message:
                "El parámetro 'weight' debe ser mayor a 1 y menor que la cantidad de frames del video",
            };
          }
          break;
        }
        case "we": {
          const [, level] = hyperparameters;
          if (
            !(
              1 < parseFloat(level.value) &&
              parseFloat(level.value) < log2(videoFrames)
            )
          ) {
            return {
              isValid: false,
              message:
                "El parámetro 'level' debe ser mayor a 1 y menor que log2(cantidad de frames del video)",
            };
          }
          break;
        }
        case "lfeb":
        case "mfeb":
        case "hfeb": {
          const [fmin, fmax, atPaso, atRechazo] = hyperparameters;
          if (
            !(
              0 <= parseFloat(fmin.value) &&
              parseFloat(fmin.value) < parseFloat(fmax.value) &&
              parseFloat(fmax.value) < 1
            )
          ) {
            return {
              isValid: false,
              message: "Debe cumplirse: 0 <= Fmin < Fmax < 1",
            };
          }
          if (!(parseFloat(fmax.value) - parseFloat(fmin.value) > 0.01)) {
            return {
              isValid: false,
              message: "La diferencia entre Fmax y Fmin debe ser mayor a 0.01",
            };
          }
          if (
            !(
              0 <= parseFloat(atPaso.value) &&
              parseFloat(atPaso.value) < parseFloat(atRechazo.value) &&
              parseFloat(atRechazo.value) < 100
            )
          ) {
            return {
              isValid: false,
              message: "Debe cumplirse: 0 <= atPaso < atRechazo < 100",
            };
          }
          break;
        }
        default:
          break;
      }
    }

    return { isValid: true, message: "Parámetros válidos" };
  };

  const calculateDescriptorResults = async () => {
    setIsLoading(true);
    try {
      await dispatch(initializeDescriptorsResult(token));
      send({ type: "NEXT" });
      dispatch(
        createNotification(`Resultados generados correctamente.`, "success")
      );
      setIsLoading(false);
    } catch (error) {
      console.error("Error al procesar la petición:", error);
      dispatch(
        createNotification(`Ha ocurrido un error vuelve a intentarlo.`, "error")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    send({ type: "BACK" });
  };

  const handleNext = async () => {
    if (chekedDescriptors.length === 0) {
      send({ type: "BACK" });
      return;
    }

    const { isValid, message } = areHyperparamsValid();

    if (!isValid) {
      dispatch(createNotification(`No cumple con la condicion: ${message}`));
      return;
    }

    if (!tokenLoading && token) {
      if (descriptorsResults.length !== 0) {
        const answer = await dispatch(
          showConfirmationAlertAsync({
            title: `Calculando descriptores`,
            message:
              "Ya has calculado los resultados en este entrenamiento. ¿Deseas volver a generar nuevos resultados? Se sobreescribiran los resultados anteriormente calculados.",
          })
        );

        if (answer) {
          calculateDescriptorResults();
        } else {
          send({ type: "NEXT" });
        }
      } else {
        calculateDescriptorResults();
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
      {isLoading ? (
        <div className='steps-container'>
          <Loader stepTitle='Generando resultados de descriptores' />
        </div>
      ) : (
        <>
          <div className='steps-container'>
            <h2>3. Seleccionar hiperparámetros</h2>
            <h3>
              Si los descriptores seleccionados disponen de hiperparámetros
              ajustables, modifique sus valores para optimizar el análisis. En
              caso contrario, avance al siguiente paso. Use el botón
              “Restablecer valores” para volver a la configuración
              predeterminada en cualquier momento.
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
                "Los descriptores seleccionados no poseen hiperparámetros editables."
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
            ) : null}

            <PrimaryButton
              handleClick={handleNext}
              RightSVG={ArrowRightIcon}
              text={"Generar resultados"}
            />
          </div>
        </>
      )}
    </>
  );
};

export default EditHyperparameters;
