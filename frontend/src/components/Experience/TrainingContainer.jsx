import { styled } from "styled-components";

import { useEffect } from "react";

// Maquina de estados
import { useMachine } from "@xstate/react";
import TrainingMachine from "../../machines/trainingMachine";

//Redux
import { useDispatch, useSelector } from "react-redux";
import {
  resetTraining,
  setName,
  initializeTrainingAsync,
} from "../../reducers/trainingReducer";
import { showConfirmationAlertAsync } from "../../reducers/alertReducer";
import { createNotification } from "../../reducers/notificationReducer.jsx";

// Componentes de estado
import UploadVideo from "./TrainingStates/1_UploadVideo.jsx";
import SelectDescriptors from "./TrainingStates/2_SelectDescriptors.jsx";
import EditHyperparameters from "./TrainingStates/3_EditHyperparameters.jsx";
import SelectDescriptorsResults from "./TrainingStates/4_SelectDescriptorsResults.jsx";
import SelectClustering from "./TrainingStates/5_SelectClustering.jsx";
import EditClusteringParams from "./TrainingStates/6_EditClusteringParams.jsx";
import SelectClusteringResults from "./TrainingStates/7_SelectClusteringResults.jsx";
import EditNeuralNetworkParams from "./TrainingStates/8_EditNeuralNetworkParams.jsx";
import EditNeuralNetworkLayers from "./TrainingStates/9_EditNeuralNetworkLayers.jsx";
import NeuralNetworkResult from "./TrainingStates/10_NeuralNetworkResult.jsx";

// Commons
import SecondaryButton from "../common/SecondaryButton";
import EditableTitle from "../common/EditableTitle";

// Icons
import NewExperienceIcon from "../../assets/svg/icon-lus-circle.svg?react";

//Utils
import { convertToReadableDateAndHour } from "../../utils/dateUtils";

// Hooks
import useToken from "../../Hooks/useToken.jsx";

const StyledExperienceContainer = styled.main`
  height: 89vh;
  display: grid;
  grid-template-rows: auto 1fr;

  @media (min-height: 900px) {
    height: 91vh;
  }
`;

const ExperienceHeader = styled.div`
  font-family: Inter;
  height: 10vh;
  display: grid;
  padding: 0.25rem 2rem;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  border-bottom: 2px solid var(--dark-500);
  z-index: 2;

  &:has(:nth-child(3):last-child) {
    grid-template-columns: auto 1fr auto;
  }

  &:has(:nth-child(4)) {
    grid-template-columns: auto auto 1fr auto;

    & > :nth-child(1) {
      margin-left: -20px;
      margin-right: -20px;
    }

    & > :nth-child(2) {
      max-width: 40vw; /* Ajusta el ancho máximo */
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  p {
    color: var(--dark-400);
    font-feature-settings: "calt" off;

    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
    line-height: 150%; /* 1.5rem */
    letter-spacing: -0.01rem;
  }

  svg {
    color: var(--dark-800);
  }

  @media (min-height: 900px) {
    height: 8vh;
  }
`;

const ExperienceContent = styled.div`
  max-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr auto;
  padding: 0rem 2rem 1rem 2rem;
  gap: 1rem;
  overflow-y: auto;

  /* Personaliza el ancho de la barra */
  &::-webkit-scrollbar {
    width: 6px;
    box-sizing: content-box;
  }

  /* Color del track (fondo de la barra) */
  &::-webkit-scrollbar-track {
    background: var(--dark-200);
    // border-radius: 6px;
  }

  /* Color y estilo de la “thumb” (la parte que se mueve) */
  &::-webkit-scrollbar-thumb {
    background-color: var(--dark-400);
    // border-radius: 6px;
  }

  /* Efecto hover para la thumb */
  &::-webkit-scrollbar-thumb:hover {
    background-color: var(--dark-300);
  }

  .steps-container {
    position: sticky;
    top: 0px;
    background: var(--white);
    display: flex;
    padding: 1rem 0 0.5rem 0;
    flex-direction: column;
    align-items: flex-start;
    align-self: stretch;
    box-shadow: 0px 10px 10px rgb(255 255 255 / 100%);
    z-index: 2;
  }

  .steps-container h2 {
    color: var(--dark-800);

    font-family: Inter;
    font-size: 1.6rem;
    font-style: normal;
    font-weight: 700;
    line-height: 140%; /* 2.6rem */
  }

  .steps-container h3 {
    color: var(--dark-400);

    font-family: Inter;
    font-size: 1rem;
    font-style: normal;
    font-weight: 600;
    line-height: 150%;
  }

  .one-button-container {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .two-buttons-container {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const TrainingContainer = () => {
  const dispatch = useDispatch();
  const [state, send] = useMachine(TrainingMachine);
  const { token, loading: tokenLoading } = useToken();

  //0.
  const trainingStatus = useSelector((state) => state.training.status);
  const trainingName = useSelector((state) => state.training.name);
  const createdAt = useSelector((state) => state.training.createdAt);
  //1.
  const video = useSelector((state) => state.training.video);
  //2.
  const descriptors = useSelector((state) => state.training.descriptors);
  //3.
  const chekedDescriptors = descriptors.filter(
    (descriptor) => descriptor.checked
  );
  //5.
  const clustering = useSelector((state) => state.training.clustering);
  //6.
  const chekedClustering = clustering.filter((algorithm) => algorithm.checked);
  //8.
  const neuralNetworkParams = useSelector(
    (state) => state.training.neuralNetworkParams
  );
  // 9
  const layerTemplate = useSelector((state) => state.training.layersTemplate);
  const layers = useSelector((state) => state.training.neuralNetworkLayers);
  // 10
  // const trainingResult = useSelector((state) => state.training.trainingResult);
  const training = useSelector((state) => state.training);

  useEffect(() => {
    if (!tokenLoading && token && trainingStatus === "idle") {
      dispatch(initializeTrainingAsync(token));
    }
  }, [tokenLoading, token, trainingStatus, dispatch]);

  // Renderiza el estado actual
  const renderState = () => {
    switch (state.value) {
      case "UPLOAD_VIDEO": //1
        return <UploadVideo send={send} video={video} />;
      case "SELECT_DESCRIPTORS": //2
        return <SelectDescriptors send={send} descriptors={descriptors} />;
      case "EDIT_HYPERPARAMETERS": //3
        return (
          <EditHyperparameters
            send={send}
            chekedDescriptors={chekedDescriptors}
            video={video?.frames}
          />
        );
      case "SELECT_DESCRIPTOR_RESULTS": //4
        return <SelectDescriptorsResults send={send} />;
      case "SELECT_CLUSTERING": //5
        return (
          <SelectClustering send={send} clusteringAlgorithms={clustering} />
        );
      case "EDIT_CLUSTER_PARAMS": //6
        return (
          <EditClusteringParams
            send={send}
            chekedClustering={chekedClustering}
          />
        );
      case "SELECT_CLUSTERING_RESULTS": //7
        return <SelectClusteringResults send={send} />;
      case "EDIT_NEURAL_NETWORK_PARAMS": //8
        return (
          <EditNeuralNetworkParams
            send={send}
            networkParams={neuralNetworkParams}
          />
        );
      case "EDIT_NEURAL_NETWORK_LAYERS": //9
        return (
          <EditNeuralNetworkLayers
            send={send}
            layerTemplate={layerTemplate}
            layers={layers}
          />
        );
      case "NEURAL_NETWORK_RESULTS": //10
        return (
          <NeuralNetworkResult
            send={send}
            training={training}
            chekedDescriptors={chekedDescriptors}
          />
        );
      default:
        return null;
    }
  };

  const handleSaveTitle = (newTitle) => {
    dispatch(setName(newTitle));
  };

  const handleReset = async () => {
    const answer = await dispatch(
      showConfirmationAlertAsync({
        title: "Nuevo entrenamiento",
        message:
          '¿Deseas comenzar un nuevo entrenamiento?\nAl hacerlo, se perderá todo el progreso actual. Si prefieres conservarlo, tendrás la opción de guardarlo al final del proceso para consultarlo en la sección "Consulta".',
      })
    );

    if (!answer) {
      return;
    }

    //Training Reducer
    dispatch(resetTraining());
    if (!tokenLoading && token) {
      dispatch(initializeTrainingAsync(token));
    }
    //State Machine
    send({ type: "RESET" });

    dispatch(
      createNotification("Nuevo entrenamiento creado.")
    );
  };

  return (
    <StyledExperienceContainer>
      <ExperienceHeader>
        <EditableTitle initialTitle={trainingName} onSave={handleSaveTitle} />
        <p>{convertToReadableDateAndHour(createdAt)}</p>
        <SecondaryButton
          SVG={NewExperienceIcon}
          text={"Nuevo entrenamiento"}
          handleClick={handleReset}
        />
      </ExperienceHeader>
      <ExperienceContent>{renderState()}</ExperienceContent>
    </StyledExperienceContainer>
  );
};

export default TrainingContainer;
