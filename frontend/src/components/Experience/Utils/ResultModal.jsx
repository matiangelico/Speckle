import { styled } from "styled-components";

import ReactModal from "react-modal";

//Redux
import { useDispatch } from "react-redux";
import { createNotification } from "../../../reducers/notificationReducer";

//Components
import SvgButton from "../../common/SvgButton";
import Base64Image from "../../common/Base64Image";
import SecondaryDownloadButton from "../../common/SecondaryDownloadButton";
import PrimaryDownloadButton from "../../common/PrimaryDownloadButton";

//Utils
import {
  downloadTxt,
  downloadCsv,
  downloadJson,
} from "../../../utils/matrixUtils";
import {
  downloadPng,
  downloadJpg,
  downloadSvg,
  downloadPdf,
} from "../../../utils/imagesUtils";

//Icons
import DownloadIcon from "../../../assets/svg/icon-download.svg?react";
import CrossIcon from "../../../assets/svg/icon-x.svg?react";
import FileTextIcon from "../../../assets/svg/icon-file-text.svg?react";

//Services
import trainingService from "../../../services/training";

// Modal & Overlay styles in GlobalStyles

const ModalHeader = styled.div`
  display: grid;
  // height: 54px;
  padding: 2px 4px 2px 24px;
  align-items: center;
  align-self: stretch;
  flex-shrink: 0;
  gap: 8px;
  border-radius: 16px 16px 0 0;
  border-bottom: 2px solid var(--dark-800, #2d3648);
  background: var(--white);

  grid-template-columns: ${
    ({ childCount }) =>
      childCount === 2 ? "1fr auto" : childCount === 3 ? "auto 1fr auto" : "1fr" // un valor por defecto si no son 2 o 3
  };

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
  modalClassName = "Modal",
  overlayClassName = "Overlay",
}) => {
  const dispatch = useDispatch();
  const matrixAvailableFormats = [
    { value: "txt", label: "TXT" },
    { value: "csv", label: "CSV" },
    { value: "json", label: "JSON" },
  ];
  const imageAvailableFormats = [
    { value: "png", label: "PNG" },
    { value: "jpg", label: "JPG" },
    { value: "svg", label: "SVG" },
    { value: "pdf", label: "PDF" },
  ];

  if (!image) return null; // No renderizar si no hay imagen

  const downloadByFormat = (format, image, title) => {
    switch (format.toUpperCase()) {
      //Matrix
      case "TXT":
        return downloadTxt(image, `${title}-matrix.txt`);
      case "CSV":
        return downloadCsv(image, `${title}-matrix.csv`);
      case "JSON":
        return downloadJson(image, `${title}-matrix.json`);
      //Image
      case "PNG":
        return downloadPng(image, `${title}-image.png`);
      case "JPG":
        return downloadJpg(image, `${title}-image.jpg`);
      case "SVG":
        return downloadSvg(image, `${title}-image.svg`);
      case "PDF":
        return downloadPdf(image, `${title}-image.pdf`);
      default:
        return downloadPng(image, `${title}-image.png`);
    }
  };

  const handleDownload = async (format) => {
    const isMatrix = matrixAvailableFormats.some(
      (formatToCheck) => formatToCheck.value === format
    );
    let matrix = null;

    if (isMatrix) {
      try {
        matrix = await trainingService.getDescriptorsMatrix();
        console.log(matrix);
      } catch (error) {
        console.error("Error:", error);
        dispatch(
          createNotification(
            `Hubo un error al intentar generar la matriz.`,
            "error"
          )
        );
      }
    }

    downloadByFormat(format, matrix === null ? image : matrix, title)
      .then(() => {
        dispatch(
          createNotification(
            `${format.toUpperCase()} descargado correctamente.`,
            "success"
          )
        );
      })
      .catch(() => {
        dispatch(
          createNotification(
            `Error al descargar el ${format.toUpperCase()}.`,
            "error"
          )
        );
      });
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose} // Cierra el modal al hacer clic en el overlay o presionar Escape
      className={modalClassName}
      overlayClassName={overlayClassName}
      shouldCloseOnOverlayClick={true} // Habilita cierre al hacer clic en el overlay
    >
      <ModalHeader childCount={subtitle ? 3 : 2}>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle} clusters</p>}
        <SvgButton SvgIcon={CrossIcon} onClick={onClose} />
      </ModalHeader>

      <ModalContent>
        <Base64Image base64Image={image} title={title} />

        <ButtonSection>
          <SecondaryDownloadButton
            SVG={FileTextIcon}
            onDownload={handleDownload}
            defaultFormat='txt'
            formats={matrixAvailableFormats}
          />

          <PrimaryDownloadButton
            SVG={DownloadIcon}
            onDownload={handleDownload}
            defaultFormat='png'
            formats={imageAvailableFormats}
          />
        </ButtonSection>
      </ModalContent>
    </ReactModal>
  );
};

export default ResultModal;
