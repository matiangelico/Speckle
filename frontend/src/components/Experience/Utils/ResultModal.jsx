import { styled } from "styled-components";

import ReactModal from "react-modal";

//Components
import SvgButton from "../../common/SvgButton";
import PrimaryButton from "../../common/PrimaryButton";
import SecondaryButton from "../../common/SecondaryButton";
import Base64Image from "../../common/Base64Image";

//Utils
import { downloadImage } from "../../../utils/downloadUtils";

//Icons
import DownloadIcon from "../../../assets/svg/icon-download.svg?react";
import CrossIcon from "../../../assets/svg/icon-x.svg?react";
import FileTextIcon from "../../../assets/svg/icon-file-text.svg?react";

// Modal & Overlay styles in GlobalStyles

const ModalHeader = styled.div`
  display: flex;
  height: 54px;
  padding: 8px 4px 8px 24px;
  align-items: center;
  flex-shrink: 0;
  align-self: stretch;

  border-radius: 16px 16px 0 0;
  border-bottom: 2px solid var(--dark-800, #2d3648);
  background: var(--white);

  h2 {
    flex: 1;
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--dark-800, #2d3648);
  }

  svg {
    width: 32px;
    height: 32px;
  }
`;

const ModalContent = styled.div`
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--white);
  border-radius: 0 0 16px 16px;

  img {
    max-width: 100%;
    border-radius: 8px;
    margin-bottom: 8px;
  }
`;

const ButtonSection = styled.div`
  display: flex;
  justify-content: space-evenly;
  margin-top: 16px;
  align-self: stretch;

  button {
    display: flex;
    padding: 8px 16px;
    justify-content: center;
    align-items: center;
    gap: 8px;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const ResultModal = ({
  image,
  title = "Modal text!",
  isOpen,
  onClose,
  modalClassName = "Modal",
  overlayClassName = "Overlay",
}) => {
  if (!image) return null; // No renderizar si no hay imagen

  const handleDownloadMatrix = () => {
    console.log("implementar descarga xd");
  };

  const handleDownloadImage = () => {
    if (image) {
      downloadImage(image, `${title}-image.png`);
    }
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose} // Cierra el modal al hacer clic en el overlay o presionar Escape
      className={modalClassName}
      overlayClassName={overlayClassName}
      shouldCloseOnOverlayClick={true} // Habilita cierre al hacer clic en el overlay
    >
      <ModalHeader>
        <h2>{title}</h2>
        {/* Botón de cerrar modal */}
        <SvgButton SvgIcon={CrossIcon} onClick={onClose} />
      </ModalHeader>

      <ModalContent>
        <Base64Image base64Image={image} title={title} />
        <ButtonSection>
          <SecondaryButton
            handleClick={handleDownloadMatrix}
            SVG={FileTextIcon}
            text={"Descargar matriz"}
          />
          <PrimaryButton
            handleClick={handleDownloadImage}
            LeftSVG={DownloadIcon}
            text={"Imprimir imagen"}
          />
        </ButtonSection>
      </ModalContent>
    </ReactModal>
  );
};

export default ResultModal;
