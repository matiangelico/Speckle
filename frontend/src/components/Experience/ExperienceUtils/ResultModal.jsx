import { styled } from "styled-components";

import ReactModal from "react-modal";

//Components
import SvgButton from "../../common/SvgButton";
import Base64Image from "../../common/Base64Image";
import SecondaryDownloadButton from "../../common/SecondaryDownloadButton";
import PrimaryDownloadButton from "../../common/PrimaryDownloadButton";

//Icons
import DownloadIcon from "../../../assets/svg/icon-download.svg?react";
import CrossIcon from "../../../assets/svg/icon-x.svg?react";
import FileTextIcon from "../../../assets/svg/icon-file-text.svg?react";

//Hooks
import useDownload, {
  matrixAvailableFormats,
  imageAvailableFormats,
} from "../../../Hooks/useDownload";

const ModalHeader = styled.div`
  display: grid;
  padding: 2px 4px 2px 24px;
  align-items: center;
  align-self: stretch;
  flex-shrink: 0;
  gap: 8px;
  border-radius: 16px 16px 0 0;
  border-bottom: 2px solid var(--dark-800, #2d3648);
  background: var(--white);

  /* Usamos la transient prop $childCount para definir las columnas */
  grid-template-columns: ${({ $childCount }) =>
    $childCount === 2
      ? "1fr auto"
      : $childCount === 3
      ? "auto 1fr auto"
      : "1fr"};

  h2 {
    flex: 1;
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--dark-800, #2d3648);
  }

  p {
    color: var(--dark-400);
    font-feature-settings: "calt" off;
    font-size: 1rem;
    font-style: normal;
    font-weight: 500;
    line-height: 150%;
    letter-spacing: -0.01rem;
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
    max-height: 100%;
  }
`;

const ButtonSection = styled.div`
  display: flex;
  justify-content: space-evenly;
  margin-top: 16px;
  align-self: stretch;

  button {
    display: flex;
    padding: 8px 12px;
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
  title,
  subtitle,
  isOpen,
  onClose,
  token = null,
  type,
  methodId,
  isMatrixDownloadable = true,
  modalClassName = "Modal",
  overlayClassName = "Overlay",
}) => {
  const { handleDownload } = useDownload({ token, image, type, methodId, title });

  if (!image) return null; // No renderizar si no hay imagen

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={modalClassName}
      overlayClassName={overlayClassName}
      shouldCloseOnOverlayClick={true}
    >
      <ModalHeader $childCount={subtitle ? 3 : 2}>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle} clusters</p>}
        <SvgButton SvgIcon={CrossIcon} onClick={onClose} />
      </ModalHeader>

      <ModalContent>
        <Base64Image base64Image={image} title={title} />

        <ButtonSection>
          {isMatrixDownloadable && (
            <SecondaryDownloadButton
              SVG={FileTextIcon}
              onDownload={(format) => handleDownload(format, null)}
              defaultFormat='txt'
              formats={matrixAvailableFormats}
            />
          )}

          <PrimaryDownloadButton
            SVG={DownloadIcon}
            onDownload={(format) => handleDownload(format, image)}
            defaultFormat='png'
            formats={imageAvailableFormats}
          />
        </ButtonSection>
      </ModalContent>
    </ReactModal>
  );
};

export default ResultModal;
