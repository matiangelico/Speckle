import styled from "styled-components";

import { useState } from "react";

//Redux
import { useDispatch } from "react-redux";
import {
  updateClusteringParam,
  initializeClusteringResult,
  resetClusteringParams,
} from "../../../reducers/trainingReducer";
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

const EditClusteringParams = ({ send, chekedClustering }) => {
  const dispatch = useDispatch();
  const { token, loading: tokenLoading } = useToken();
  const [isLoading, setIsLoading] = useState(false);

  const chekedClusteringParams = chekedClustering.filter(
    (clustering) => clustering.parameters.length > 0
  );

  const handleBack = () => {
    send({ type: "BACK" });
  };

  const handleNext = async () => {
    if (chekedClustering.length === 0) {
      return;
    }

    if (!tokenLoading && token) {
      setIsLoading(true);
      try {
        await dispatch(initializeClusteringResult(token));
        // Aquí podrías agregar validaciones adicionales para los hiperparámetros
        send({ type: "NEXT" });
        dispatch(
          createNotification(`Resultados generados correctamente.`, "success")
        );
        setIsLoading(false);
      } catch (error) {
        console.error("Error al procesar la petición:", error);
        dispatch(
          createNotification(
            `Ha ocurrido un error vuelve a intentarlo.`,
            "error"
          )
        );
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
