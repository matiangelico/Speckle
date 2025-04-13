import styled from "styled-components";

import { useState } from "react";

//Redux
import { useDispatch } from "react-redux";
import {
  setClusteringJSON,
  selectClusteringResult,
  setNumberOfClusters,
  getFeaturedMatrixData,
} from "../../../reducers/trainingReducer";
import { showConfirmationAlertAsync } from "../../../reducers/alertReducer";
import { createNotification } from "../../../reducers/notificationReducer";

//Commons
import PrimaryButton from "../../common/PrimaryButton";
import SecondaryButton from "../../common/SecondaryButton";
import ResultContainer from "../../common/ResultContainer";

//Utils
import ResultModal from "../ExperienceUtils/ResultModal";
import FileDropArea from "../ExperienceUtils/FileDropArea";

//Icons
import ArrowRightIcon from "../../../assets/svg/icon-arrow-right.svg?react";
import ArrowLeftIcon from "../../../assets/svg/icon-arrow-left.svg?react";

//Hooks
import useToken from "../../../Hooks/useToken";

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

const Separator = styled.div`
  margin: 0.5rem 0;
  position: relative;
  text-align: center;
  color: var(--dark-800, #080a11);

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    width: 45%;
    height: 2px;
    background: var(--dark-400, #080a11);
  }

  &::before {
    left: 0;
  }

  &::after {
    right: 0;
  }
`;

const SelectClusteringResults = ({
  send,
  clusteringJSON,
  clusteringResults,
  video,
}) => {
  const dispatch = useDispatch();
  const { token } = useToken();
  const [modalInfo, setModalInfo] = useState(null);

  const handleBack = () => {
    send({ type: "BACK" });
  };

  const setClusteringSettings = () => {
    const isAnyClusteringChecked = clusteringResults.some(
      (result) => result.checked
    );

    if (isAnyClusteringChecked) {
      const selectedCluster = clusteringResults.find(result => result.checked === true);

      dispatch(setNumberOfClusters(selectedCluster.clusterCenters));
      send({ type: "NEXT" });
    } else {
      dispatch(
        createNotification(
          "Por favor, selecciona al menos un resultado para continuar."
        )
      );
    }
  };

  const handleNext = async () => {
    if (clusteringJSON !== null) {
      const answer = await dispatch(
        showConfirmationAlertAsync({
          title: `Matriz de caracteristicas detectado`,
          message:
            "Se ha detectado una matriz de caracteristicas. ¿Deseas entrenar la red con el archivo cargado? Esto hará que el clustering seleccionado no tenga efecto en el entrenamiento.",
        })
      );

      if (answer) {
        send({ type: "NEXT" });
      } else {
        dispatch(setClusteringJSON(null));

        setClusteringSettings();
      }
    } else {
      setClusteringSettings();
    }
  };

  const handleFileDrop = async (file) => {
    const validTypes = ["application/json"];

    if (!validTypes.includes(file.type)) {
      dispatch(
        createNotification("Solo se permite cargar archivos .json", "error")
      );
      return;
    }

    dispatch(getFeaturedMatrixData(file));
    dispatch(createNotification(`Archivo subido correctamente.`, "success"));
  };

  const openModal = (image, title, subtitle, id) => {
    setModalInfo({ image, title, subtitle, token, type: "clustering", id });
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
          Examine los resultados tras aplicar los algoritmos de clustering.
          Podrá ampliar las imágenes para ver detalles, descargar la matriz
          resultante o imprimir la imagen correspondiente. Seleccione al menos
          un resultado para proceder al siguiente nivel de análisis con la red
          neuronal.
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
            handleClickInfo={() =>
              openModal(
                result.image,
                result.name,
                result.clusterCenters,
                result.id
              )
            }
          />
        ))}
      </ClusteringResultsContainer>

      <Separator>o</Separator>

      <FileDropArea
        message={
          "Arrastra y suelta un archivo que contenga una matriz de caracteristicas (.json) o haz clic para seleccionar uno desde tu computadora."
        }
        onFileDrop={handleFileDrop}
        fileName={clusteringJSON?.name || ""}
        fileSize={
          clusteringJSON ? (clusteringJSON.size / (1024 * 1024)).toFixed(2) : ""
        }
      />

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
        token={modalInfo?.token}
        type={modalInfo?.type}
        methodId={modalInfo?.id}
        videoWidth={video?.width}
        videoHeight={video?.height}
        clustering={true}
      />
    </>
  );
};

export default SelectClusteringResults;
