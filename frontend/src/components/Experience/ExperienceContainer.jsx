import { styled } from "styled-components";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// Maquina de estados
import { useMachine } from "@xstate/react";
import TrainingMachine from "../../machines/trainingMachine";

//Redux
// import { createNotification } from "../../reducers/notificationReducer";
import {
  resetTraining,
  setName,
  initializeClustering,
  initializeDescriptors,
  initializeNeuralNetwork,
} from "../../reducers/trainingReducer";

// Componentes de estado
import UploadVideo from "./States/1_UploadVideo";
import SelectDescriptors from "./States/2_SelectDescriptors";
import EditHyperparameters from "./States/3_EditHyperparameters";
import SelectDescriptorsResults from "./States/4_SelectDescriptorsResults";
import EditClusteringParams from "./States/5_EditClusteringParams";
import SelectClusteringResults from "./States/6_SelectClusteringResults";
import EditNeuralNetworkParams from "./States/7_EditNeuralNetworkParams";
import NeuralNetworkResult from "./States/8_NeuralNetworkResult";

// Commons
import SecondaryButton from "../common/SecondaryButton";
import EditableTitle from "../common/EditableTitle";
import Notification from "../common/Notification";

// Icons
import NewExperienceIcon from "../../assets/svg/icon-lus-circle.svg?react";

const StyledExperienceContainer = styled.main`
  height: 87vh;
  display: grid;
  grid-template-rows: auto 1fr;
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
  }

  .steps-container h2 {
    color: var(--dark-800);

    font-family: Inter;
    font-size: 1.6rem;
    font-style: normal;
    font-weight: 700;
    line-height: 130%; /* 2.6rem */
  }

  .steps-container h3 {
    color: var(--dark-400);

    font-family: Inter;
    font-size: 1rem;
    font-style: normal;
    font-weight: 700;
    line-height: 140%; /* 1.4rem */
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

const ExperienceContainer = () => {
  const dispatch = useDispatch();
  const [state, send] = useMachine(TrainingMachine);
  //0.
  const trainingName = useSelector((state) => state.training.name);
  //2.
  const descriptors = useSelector((state) => state.training.descriptors);
  //3.
  const chekedDescriptors = descriptors.filter(
    (descriptor) => descriptor.checked && descriptor.hyperparameters.length > 0
  );
  //5.
  const clusteringParams = useSelector((state) => state.training.clustering);

  useEffect(() => {
    //Descritors
    dispatch(initializeDescriptors());
  }, [dispatch]);

  useEffect(() => {
    //Clustering
    dispatch(initializeClustering());
  }, [dispatch]);

  useEffect(() => {
    //Neural Network
    dispatch(initializeNeuralNetwork());
  }, [dispatch]);

  // Renderiza el estado actual
  const renderState = () => {
    switch (state.value) {
      case "UPLOAD_VIDEO": //1
        return <UploadVideo send={send} />;
      case "SELECT_DESCRIPTORS": //2
        return <SelectDescriptors send={send} descriptors={descriptors} />;
      case "EDIT_HYPERPARAMETERS": //3
        return (
          <EditHyperparameters
            send={send}
            chekedDescriptors={chekedDescriptors}
          />
        );
      case "SELECT_DESCRIPTOR_RESULTS": //4
        return <SelectDescriptorsResults send={send} />;
      case "EDIT_CLUSTER_PARAMS": //5
        return (
          <EditClusteringParams
            send={send}
            clusteringParams={clusteringParams}
          />
        );
      case "SELECT_CLUSTERING_RESULTS": //6
        return <SelectClusteringResults send={send} />;
      case "EDIT_NEURAL_NETWORK_PARAMS": //7
        return <EditNeuralNetworkParams send={send} />;
      case "NEURAL_NETWORK_RESULTS": //8
        return <NeuralNetworkResult send={send} />;
      default:
        return null;
    }
  };

  const handleSaveTitle = (newTitle) => {
    console.log("Nuevo título guardado:", newTitle);
    dispatch(setName(newTitle));
  };

  const handleReset = () => {
    //Training Reducer
    dispatch(resetTraining());
    dispatch(initializeDescriptors());
    dispatch(initializeClustering());
    dispatch(initializeNeuralNetwork());
    //State Machine
    send({ type: "RESET" });
  };

  // const handleShowNotification = () => {
  //   dispatch(createNotification(`Hola soy una notificacion!`));
  // };

  return (
    <StyledExperienceContainer>
      <ExperienceHeader>
        <EditableTitle initialTitle={trainingName} onSave={handleSaveTitle} />
        <p>27 de octubre de 2024, 20:33</p>
        <SecondaryButton
          SVG={NewExperienceIcon}
          text={"Nuevo entrenamiento"}
          handleClick={handleReset}
        />
      </ExperienceHeader>
      <ExperienceContent>{renderState()}</ExperienceContent>
      <Notification />
    </StyledExperienceContainer>
  );
};

export default ExperienceContainer;
