import { useDispatch } from "react-redux";

//Redux
import { createNotification } from "../reducers/notificationReducer";

// Services
import matrixServices from "../services/matrix";

// Utils
import { downloadTxt, downloadCsv, downloadJson } from "../utils/matrixUtils";
import {
  downloadPng,
  downloadJpg,
  downloadSvg,
  downloadPdf,
} from "../utils/imagesUtils";

export const matrixAvailableFormats = [
  { value: "txt", label: "TXT" },
  { value: "csv", label: "CSV" },
  { value: "json", label: "JSON" },
];

export const imageAvailableFormats = [
  { value: "png", label: "PNG" },
  { value: "jpg", label: "JPG" },
  { value: "svg", label: "SVG" },
  { value: "pdf", label: "PDF" },
];

const downloadByFormat = (format, data, title) => {
  switch (format.toUpperCase()) {
    // Matrix
    case "TXT":
      return downloadTxt(data, `${title}-matrix.txt`);
    case "CSV":
      return downloadCsv(data, `${title}-matrix.csv`);
    case "JSON":
      return downloadJson(data, `${title}-matrix.json`);
    // Image
    case "PNG":
      return downloadPng(data, `${title}-image.png`);
    case "JPG":
      return downloadJpg(data, `${title}-image.jpg`);
    case "SVG":
      return downloadSvg(data, `${title}-image.svg`);
    case "PDF":
      return downloadPdf(data, `${title}-image.pdf`);
    default:
      return downloadPng(data, `${title}-image.png`);
  }
};

const useDownload = ({ token, type, methodId, title }) => {
  const dispatch = useDispatch();

  const handleDownload = async (format, image) => {
    const isMatrix = matrixAvailableFormats.some((f) => f.value === format);
    let matrix = null;

    if (isMatrix) {
      try {
        matrix = await matrixServices.getDescriptorsMatrix(
          token,
          type,
          methodId
        );
      } catch (error) {
        console.error("Error:", error);
        dispatch(
          createNotification(
            `Hubo un error al intentar generar la matriz.`,
            "error"
          )
        );
        return;
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

  return { handleDownload };
};

export default useDownload;
