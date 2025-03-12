import styled from "styled-components";

import { useState } from "react";

//Components
import ResultContainer from "../../common/ResultContainer";
import SecondaryButton from "../../common/SecondaryButton";

//Utils
import ResultModal from "../Utils/ResultModal";

//Icons
import ArrowLeftIcon from "../../../assets/svg/icon-arrow-left.svg?react";

const CenterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: min-content;
  overflow-y: auto;

  img {
    max-width: 602px;
    max-height: 100%;
  }

  @media (min-height: 900px) {
    height: 100%;
  }
`;

const NeuralNetworkResult = ({ send, request }) => {
  const [modalInfo, setModalInfo] = useState(null);

  const result = request.requestResult;
  const trainingName = request.name;

  const handleBack = () => {
    send({ type: "BACK" });
  };

  const openModal = (image, title) => {
    setModalInfo({ image, title });
  };

  const closeModal = () => {
    setModalInfo(null);
  };

  return (
    <>
      <>
        <div className='steps-container'>
          <h2>5. Visualizar resultado de la consulta</h2>
          <h3>
            Visualice los resultados finales de la consulta. Podra
            ampliar la imagen, descargar la matriz resultante o imprimir la
            imagen. Para iniciar una nueva consulta, simplemente
            presione el botón “Reiniciar consulta”.
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

        <div className='one-button-container'>
          <SecondaryButton
            className='content'
            handleClick={handleBack}
            SVG={ArrowLeftIcon}
            text={"Editar capas de la red neuronal"}
          />

          {/* <PrimaryButton
              className='content'
              handleClick={handleSaveTraining}
              RightSVG={SaveIcon}
              text={"Guardar entrenamieto"}
            /> */}
        </div>

        <ResultModal
          image={modalInfo?.image}
          title={modalInfo?.title}
          isOpen={!!modalInfo}
          onClose={closeModal}
        />
      </>
    </>
  );
};

export default NeuralNetworkResult;
