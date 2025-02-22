import styled from "styled-components";

import { useState } from "react";

//Redux
import { useSelector } from "react-redux";

//Components
import ResultContainer from "../../common/ResultContainer";
import PrimaryButton from "../../common/PrimaryButton";
import SecondaryButton from "../../common/SecondaryButton";

//Utils
import ResultModal from "../Utils/ResultModal";

//Icons
import ArrowLeftIcon from "../../../assets/svg/icon-arrow-left.svg?react";
import SaveIcon from "../../../assets/svg/icon-save.svg?react";

const CenterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: min-content;
  overflow-y: auto;

  @media (min-height: 900px) {
    height: 100%;
  }
`;

const NeuralNetworkResult = ({ send }) => {
  const trainingName = useSelector((state) => state.training.name);
  const result = useSelector((state) => state.training.trainingResult);
  const [modalInfo, setModalInfo] = useState(null);

  const handleBack = () => {
    send({ type: "BACK" });
  };

  const handleSaveTraining = () => {};

  const openModal = (image, title) => {
    setModalInfo({ image, title });
  };

  const closeModal = () => {
    setModalInfo(null);
  };

  return (
    <>
      <div className='steps-container'>
        <h2>9. Visualizar resultado del entrenamiento de la red neuronal</h2>
        <h3>
          Visualice los resultados finales del entrenamiento de la red neuronal.
          Además de poder ampliar la imagen, descargar la matriz resultante o
          imprimir la imagen, tendrá la opción de guardar el entrenamiento para
          futuras consultas. Para iniciar un nuevo ciclo de entrenamiento,
          simplemente presione el botón “Nuevo entrenamiento”.
        </h3>
      </div>

      {result && (
        <CenterContainer>
          <ResultContainer
            title={trainingName}
            checked={false}
            base64Image={result.image}
            handleClickInfo={() => openModal(result.image, trainingName)}
          />
        </CenterContainer>
      )}

      <div className='two-buttons-container'>
        <SecondaryButton
          className='content'
          handleClick={handleBack}
          SVG={ArrowLeftIcon}
          text={"Editar capas de la red neuronal"}
        />

        <PrimaryButton
          className='content'
          handleClick={handleSaveTraining}
          RightSVG={SaveIcon}
          text={"Guardar entrenamieto"}
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

export default NeuralNetworkResult;
