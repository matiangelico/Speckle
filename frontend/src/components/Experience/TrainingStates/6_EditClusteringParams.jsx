import styled from "styled-components";

import { useState } from "react";

//Redux
import { useDispatch } from "react-redux";
import {
  updateClusteringParam,
  initializeClusteringResult,
  resetClusteringParams,
} from "../../../reducers/trainingReducer";
import { showConfirmationAlertAsync } from "../../../reducers/alertReducer";
import { createNotification } from "../../../reducers/notificationReducer";

//Components
import EmptyContainer from "../../common/EmptyContainer";
import PrimaryButton from "../../common/PrimaryButton";
import SecondaryButton from "../../common/SecondaryButton";
import Input from "../../common/Input";
import Loader from "../../common/Loader";

//Icons
import ArrowRightIcon from "../../../assets/svg/icon-arrow-right.svg?react";
import ArrowLeftIcon from "../../../assets/svg/icon-arrow-left.svg?react";
import SlidersIcon from "../../../assets/svg/icon-sliders.svg?react";

//Hooks
import useToken from "../../../Hooks/useToken";

const ClusteringParamContainer = styled.div`
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

const EditClusteringParams = ({ send, chekedClustering, clusteringResults }) => {
  const dispatch = useDispatch();
  const { token, loading: tokenLoading } = useToken();
  const [isLoading, setIsLoading] = useState(false);

  const chekedClusteringParams = chekedClustering.filter(
    (clustering) => clustering.parameters.length > 0
  );

  const areParamsValid = () => {
    for (const clustering of chekedClusteringParams) {
      const parameters = clustering.parameters;

      switch (clustering.id) {
        case "subtractiveClustering": {
          const [ra, rb, eUp, eDown] = parameters;

          if (!(0 < parseFloat(ra.value) && parseFloat(ra.value) < 1)) {
            return {
              isValid: false,
              message: "0 < ra < 1. Recomendado: 0.2 < ra < 0.8",
            };
          }

          if (
            !(
              1.2 * ra.value <= parseFloat(rb.value) &&
              parseFloat(rb.value) <= 2 * ra.value
            )
          ) {
            return {
              isValid: false,
              message: "1.2ra <= rb <= 2ra. Recomendado: rb = 1.5ra",
            };
          }

          if (
            !(0.3 <= parseFloat(eDown.value) && parseFloat(eDown.value) <= 0.7)
          ) {
            return {
              isValid: false,
              message: "0.3 <= eDown <= 0.7",
            };
          }

          if (!(0.5 <= parseFloat(eUp.value) && parseFloat(eUp.value) <= 1.0)) {
            return {
              isValid: false,
              message: "0.5 <= eUp <= 1.0",
            };
          }

          if (!(parseFloat(eUp.value) - parseFloat(eDown.value) > 0.01)) {
            return {
              isValid: false,
              message: "La diferencia entre eUp y eDown debe ser mayor a 0.01",
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

  const handleBack = () => {
    send({ type: "BACK" });
  };

  const calculateClusteringResults = async () => {
    setIsLoading(true);
      try {
        await dispatch(initializeClusteringResult(token));
        send({ type: "NEXT" });
        dispatch(
          createNotification(`Resultados generados correctamente.`, "success")
        );
      } catch (error) {
        console.error("Error al procesar la petición:", error);
        dispatch(
          createNotification(
            `Ha ocurrido un error vuelve a intentarlo.`,
            "error"
          )
        );
      } finally {
        setIsLoading(false);
      }
  }

  const handleNext = async () => {
    if (chekedClustering.length === 0) {
      send({ type: "BACK" });
      return;
    }

    const { isValid, message } = areParamsValid();

    if (!isValid) {
      dispatch(createNotification(`No cumple con la condicion: ${message}`));
      return;
    }

    if (!tokenLoading && token) {
      if (clusteringResults.length !== 0) {
        const answer = await dispatch(
          showConfirmationAlertAsync({
            title: `Generar resultados de clustering`,
            message:
              "Ya has calculado los resultados en este trenamiento. ¿Deseas volver a generar nuevos resultados? Se sobreescribiran los resultados anteriormente calculados.",
          })
        );

        if (answer) {
          calculateClusteringResults();
        } else {
          send({ type: "NEXT" });
        }
      } else {
        calculateClusteringResults();
      }
    }
  };

  const handleChangeValue = (clusteringName, paramName, newValue) => {
    dispatch(
      updateClusteringParam({
        clusteringName: clusteringName,
        parameterName: paramName,
        newValue: newValue,
      })
    );

    if (paramName == "Radio de clustering (ra)") {
      dispatch(
        updateClusteringParam({
          clusteringName: clusteringName,
          parameterName: "Factor de reducción (rb)",
          newValue: (newValue * 1.5).toFixed(2),
        })
      );
    }
  };

  const handleSetDefaultValues = () => {
    dispatch(resetClusteringParams());
  };

  return (
    <>
      {isLoading ? (
        <div className='steps-container'>
          <Loader />
        </div>
      ) : (
        <>
          <div className='steps-container'>
            <h2>6. Editar parametros de clustering</h2>
            <h3>
              Ajuste los parámetros de entrada de los algoritmos de clustering,
              en caso de que sean personalizables. Si no es necesario modificar
              parámetros, avance al siguiente paso.
            </h3>
          </div>

          {chekedClusteringParams.length > 0 ? (
            <ClusteringParamContainer>
              {chekedClusteringParams.map(
                (clustering, index) =>
                  clustering.parameters?.length > 0 && (
                    <StyledRow key={index}>
                      {clustering.parameters.map((param, paramIndex) => (
                        <Input
                          key={paramIndex}
                          primaryLabel={param.paramName}
                          secondaryLabel={clustering.name}
                          type={param.type ? param.type : "number"}
                          id={`${index}-${paramIndex}`}
                          name={param.paramName}
                          min={param.min ? param.min : 1}
                          max={param.max ? param.max : 20}
                          step={param.step ? param.step : 0.01}
                          value={param.value}
                          setValue={(newValue) =>
                            handleChangeValue(
                              clustering.name,
                              param.paramName,
                              newValue
                            )
                          }
                        />
                      ))}
                    </StyledRow>
                  )
              )}
            </ClusteringParamContainer>
          ) : (
            <EmptyContainer message='No parametros de clustering editables.' />
          )}

          <div className='two-buttons-container'>
            <SecondaryButton
              handleClick={handleBack}
              SVG={ArrowLeftIcon}
              text={"Seleccionar algoritmos de clustering"}
            />

            {chekedClusteringParams.length > 0 ? (
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
              text={"Seleccionar resultados de clustering"}
            />
          </div>
        </>
      )}
    </>
  );
};

export default EditClusteringParams;
