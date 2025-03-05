import styled from "styled-components";

import { useState } from "react";

//Redux
import { useDispatch, useSelector } from "react-redux";
import { selectClusteringResult } from "../../../reducers/trainingReducer";
import { createNotification } from "../../../reducers/notificationReducer";

//Commons
import PrimaryButton from "../../common/PrimaryButton";
import SecondaryButton from "../../common/SecondaryButton";
import ResultContainer from "../../common/ResultContainer";

//Utils
import ResultModal from "../Utils/ResultModal";

//Icons
import ArrowRightIcon from "../../../assets/svg/icon-arrow-right.svg?react";
import ArrowLeftIcon from "../../../assets/svg/icon-arrow-left.svg?react";

const ClusteringResultsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 10px;
  width: 100%;
  justify-items: center;
  height: min-content;
  overflow-y: auto;

  @media (max-width: 1020px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }

  @media (max-width: 720px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }

  @media (min-height: 900px) {
    gap: 20px;
  }
`;

const SelectClusteringResults = ({ send }) => {
  const dispatch = useDispatch();
  const clusteringResults = useSelector(
    (state) => state.training.clusteringResults
  );
  const [modalInfo, setModalInfo] = useState(null);

  const handleBack = () => {
    send({ type: "BACK" });
  };

  const handleNext = () => {
    const isAnyClusteringChecked = clusteringResults.some(
      (result) => result.checked
    );

    if (isAnyClusteringChecked) {
      send({ type: "NEXT" });
    } else {
      dispatch(
        createNotification(
          "Por favor, selecciona al menos un resultado para continuar."
        )
      );
    }
  };

  const openModal = (image, title, subtitle) => {
    setModalInfo({ image, title, subtitle });
  };

  const closeModal = () => {
    setModalInfo(null);
  };

  const handleResultSelected = (resultSelected) => {
    dispatch(selectClusteringResult(resultSelected));
  };

  return (
    <>
      <div className='steps-container'>
        <h2>7. Seleccionar resultados de clustering</h2>
        <h3>
          Examine los resultados obtenidos tras aplicar los algoritmos de
          clustering. Podrá ampliar las imágenes para ver detalles, descargar la
          matriz resultante o imprimir la imagen correspondiente. Seleccione al
          menos un resultado para proceder al siguiente nivel de análisis con la
          red neuronal.
        </h3>
      </div>

      <ClusteringResultsContainer>
        {clusteringResults.map((result, index) => (
          <ResultContainer
            key={index}
            title={result.name}
            subtitle={result.clusterCenters}
            checked={result.checked}
            base64Image={result.image}
            handleSelect={handleResultSelected}
            handleClickInfo={() => openModal(result.image, result.name, result.clusterCenters)}
          />
        ))}
      </ClusteringResultsContainer>

      <div className='two-buttons-container'>
        <SecondaryButton
          handleClick={handleBack}
          SVG={ArrowLeftIcon}
          text={"Editar parametros de clustering"}
        />

        <PrimaryButton
          handleClick={handleNext}
          RightSVG={ArrowRightIcon}
          text={"Editar parámetros de la red neuronal"}
        />
      </div>

      <ResultModal
        image={modalInfo?.image}
        title={modalInfo?.title}
        subtitle={modalInfo?.subtitle}
        isOpen={!!modalInfo}
        onClose={closeModal}
      />
    </>
  );
};

export default SelectClusteringResults;
