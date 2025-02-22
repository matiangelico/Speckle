import styled from "styled-components";

//Redux
import { useDispatch } from "react-redux";
import {
  updateClusteringParam,
  initializeClusteringResult,
  resetClusteringParams,
} from "../../../reducers/trainingReducer";

//Components
import EmptyContainer from "../../common/EmptyContainer";
import PrimaryButton from "../../common/PrimaryButton";
import SecondaryButton from "../../common/SecondaryButton";
import Input from "../../common/Input";

//Icons
import ArrowRightIcon from "../../../assets/svg/icon-arrow-right.svg?react";
import ArrowLeftIcon from "../../../assets/svg/icon-arrow-left.svg?react";
import SlidersIcon from "../../../assets/svg/icon-sliders.svg?react";

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
  const chekedClusteringParams = chekedClustering.filter(
    (clustering) => clustering.parameters.length > 0
  );

  const handleBack = () => {
    send({ type: "BACK" });
  };

  const handleNext = () => {
    dispatch(initializeClusteringResult());

    if (chekedClusteringParams.length !== 0) {
      // ALGUNA VALIDACION DE HIPERPARAMETROS?
      send({ type: "NEXT" });
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
      <div className='steps-container'>
        <h2>6. Editar parametros de clustering</h2>
        <h3>
          Ajuste los parámetros de entrada de los algoritmos de clustering, en
          caso de que sean personalizables. Si no es necesario modificar
          parámetros, avance al siguiente paso.
        </h3>
      </div>

      {chekedClusteringParams.length > 0 ? (
        <ClusteringParamContainer>
          {chekedClusteringParams.map(
            (clustering, index) =>
              clustering.parameters?.length > 0 && (
                <StyledRow key={index}>
                  {clustering.parameters.map((param) => (
                    <Input
                      key={index}
                      primaryLabel={param.paramName}
                      secondaryLabel={clustering.name}
                      type={param.type ? param.type : "number"}
                      id={index}
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
  );
};

export default EditClusteringParams;
