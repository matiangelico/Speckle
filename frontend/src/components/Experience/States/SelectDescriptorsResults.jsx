import styled from "styled-components";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

//Commons
import PrimaryButton from "../../common/PrimaryButton";
import SecondaryButton from "../../common/SecondaryButton";
import ResultContainer from "../../common/resultContainer";

//Icons
import ArrowRightIcon from "../../../assets/svg/icon-arrow-right.svg?react";
import ArrowLeftIcon from "../../../assets/svg/icon-arrow-left.svg?react";
import { selectResultDescriptor } from "../../../reducers/trainingReducer";
import ResultModal from "../Utils/ResultModal";

const DescriptorResultsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(250px, 1fr)
  ); /* Crea columnas que se ajustan al tamaño */
  gap: 10px;
  width: 100%;
  height: min-content;
  overflow-y: auto;

  @media (min-height: 900px) {
    gap: 20px;
  }
`;

const SelectDescriptorsResults = ({ send }) => {
  const dispatch = useDispatch();
  const descriptorsResults = useSelector(
    (state) => state.training.descriptorsResults
  );
  const [modalInfo, setModalInfo] = useState(null);

  console.log("descriptorsResults", descriptorsResults);

  const handleBack = () => {
    send({ type: "BACK" });
  };

  const handleNext = () => {
    send({ type: "NEXT" });
  };

  const openModal = (image, title) => {
    setModalInfo({ image, title });
  };

  const closeModal = () => {
    setModalInfo(null);
  };

  const handleResultSelected = (resultSelected) => {
    dispatch(selectResultDescriptor(resultSelected));
  };

  return (
    <>
      <div className='steps-container'>
        <h2>4. Seleccionar resultados de descriptores</h2>
        <h3>
          Explora y elige los archivos que deseas cargar desde tu computadora
        </h3>
      </div>

      <DescriptorResultsContainer>
        {descriptorsResults.map((result, index) => (
          <ResultContainer
            key={index}
            title={result.name}
            checked={result.checked}
            base64Image={result.image}
            handleSelect={handleResultSelected}
            handleClickInfo={() => openModal(result.image, result.name)}
          />
        ))}
      </DescriptorResultsContainer>

      <div className='two-buttons-container'>
        <SecondaryButton
          handleClick={handleBack}
          SVG={ArrowLeftIcon}
          text={"Seleccionar hiperparametros"}
        />

        <PrimaryButton
          handleClick={handleNext}
          SVG={ArrowRightIcon}
          text={"Editar parametros de clustering"}
        />
      </div>

      <ResultModal
        image={modalInfo?.image}
        title={modalInfo?.title}
        isOpen={!!modalInfo}
        onClose={closeModal}
      />
    </>
  );
};

export default SelectDescriptorsResults;
