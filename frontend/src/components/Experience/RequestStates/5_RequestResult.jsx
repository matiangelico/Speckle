import styled from "styled-components";

import { useState } from "react";

//Components
import ResultContainer from "../../common/ResultContainer";
import SecondaryButton from "../../common/SecondaryButton";
import SecondaryDownloadButton from "../../common/SecondaryDownloadButton";

//Utils
import ResultModal from "../ExperienceUtils/ResultModal";

//Icons
import ArrowLeftIcon from "../../../assets/svg/icon-arrow-left.svg?react";
import FileTextIcon from "../../../assets/svg/icon-file-text.svg?react";

//Hooks
import useToken from "../../../Hooks/useToken";
import useDownload, {
  matrixAvailableFormats,
} from "../../../Hooks/useDownload";

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

const RequestResults = ({ send, request }) => {
  const [modalInfo, setModalInfo] = useState(null);
  const { token } = useToken();
  const { handleDownload } = useDownload({
    token,
    type: "prediction",
    methodId: "tensor",
    title: "Descargar tensor",
  });

  const result = request.requestResult;
  const trainingName = request.name;

  const handleBack = () => {
    send({ type: "BACK" });
  };

  const openModal = (image, title) => {
    setModalInfo({ image, title, token, type: "prediction", id: "matrix" });
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
            Visualice los resultados finales de la consulta. Podra ampliar la
            imagen, descargar la matriz resultante o imprimir la imagen. Para
            iniciar una nueva consulta, simplemente presione el botón “Reiniciar
            consulta”.
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
            text={"Resultados de descriptores"}
          />

          <SecondaryDownloadButton
            SVG={FileTextIcon}
            text='Descargar tensor'
            onDownload={handleDownload}
            defaultFormat='txt'
            formats={matrixAvailableFormats}
          />
        </div>

        <ResultModal
          image={modalInfo?.image}
          title={modalInfo?.title}
          isOpen={!!modalInfo}
          onClose={closeModal}
          token={modalInfo?.token}
          type={modalInfo?.type}
          methodId={modalInfo?.id}
        />
      </>
    </>
  );
};

export default RequestResults;
