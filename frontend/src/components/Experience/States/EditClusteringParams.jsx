import styled from "styled-components";

//Redux
import { useDispatch, useSelector } from "react-redux";
import {
  initializeClustering,
  updateClusteringParam,
  initializeClusteringResult,
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
  grid-template-columns: repeat(2, 1fr);
  gap: 10px 10px;
  width: 100%;
  height: min-content;
  overflow-y: auto;

  @media (min-width: 1020px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1920px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (min-height: 900px) {
    gap: 20px;
  }
`;

const EditClusteringParams = ({ send }) => {
  const dispatch = useDispatch();
  const clusteringParams = useSelector((state) => state.training.clustering);

  const handleBack = () => {
    send({ type: "BACK" });
  };

  const handleNext = () => {
    dispatch(initializeClusteringResult());

    send({ type: "NEXT" });
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
    dispatch(initializeClustering());
  };

  return (
    <>
      <div className='steps-container'>
        <h2>5. Editar parametros de clustering</h2>
        <h3>
          Explora y elige los archivos que deseas cargar desde tu computadora
        </h3>
      </div>

      {clusteringParams.length > 0 ? (
        <ClusteringParamContainer>
          {clusteringParams.map(
            (clustering, index) =>
              clustering.parameters?.length > 0 &&
              clustering.parameters.map((param) => (
                <Input
                  key={index}
                  primaryLabel={param.paramName}
                  secondaryLabel={clustering.name}
                  type='number'
                  id={index}
                  name={param.paramName}
                  value={param.value}
                  setValue={(newValue) =>
                    handleChangeValue(
                      clustering.name,
                      param.paramName,
                      newValue
                    )
                  }
                />
              ))
          )}
        </ClusteringParamContainer>
      ) : (
        <EmptyContainer message='No parametros de clustering editables.' />
      )}

      <div className='two-buttons-container'>
        <SecondaryButton
          handleClick={handleBack}
          SVG={ArrowLeftIcon}
          text={"Seleccionar resultados de descriptores"}
        />

        {clusteringParams.length > 0 ? (
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
          text={"Generar resultados de clustering"}
        />
      </div>
    </>
  );
};

export default EditClusteringParams;
