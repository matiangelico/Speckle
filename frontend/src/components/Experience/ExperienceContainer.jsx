import { styled } from "styled-components";

import { useEffect } from "react";
import { useDispatch } from "react-redux";

// Maquina de estados
import { useMachine } from "@xstate/react";
import TrainingMachine from "../../machines/trainingMachine";

//Redux
import {
  setName,
  initializeClustering,
  initializeDescriptors,
  initializeNeuralNetwork,
} from "../../reducers/trainingReducer";

// Componentes de estado
import UploadVideo from "./States/UploadVideo";
import SelectDescriptors from "./States/SelectDescriptors";
import EditHyperparameters from "./States/EditHyperparameters";
import SelectDescriptorsResults from "./States/SelectDescriptorsResults";
import EditClusteringParams from "./States/EditClusteringParams";
import SelectClusteringResults from "./States/SelectClusteringResults";
import EditNeuralNetworkParams from "./States/EditNeuralNetworkParams";
import NeuralNetworkResult from "./States/NeuralNetworkResult";

// Commons
import SecondaryButton from "../common/SecondaryButton";
import EditableTitle from "../common/EditableTitle";

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
  // grid-template-columns: auto auto 1fr auto;
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

  useEffect(() => {
    dispatch(initializeDescriptors());
    dispatch(initializeClustering());
    dispatch(initializeNeuralNetwork());
  }, [dispatch]);

  // Renderiza el estado actual basado en `state.value`
  const renderState = () => {
    switch (state.value) {
      case "UPLOAD_VIDEO": //1
        return <UploadVideo context={state.context} send={send} />;
      case "SELECT_DESCRIPTORS": //2
        return <SelectDescriptors context={state.context} send={send} />;
      case "EDIT_HYPERPARAMETERS": //3
        return <EditHyperparameters context={state.context} send={send} />;
      case "SELECT_DESCRIPTOR_RESULTS": //4
        return <SelectDescriptorsResults context={state.context} send={send} />;
      case "EDIT_CLUSTER_PARAMS": //5
        return <EditClusteringParams context={state.context} send={send} />;
      case "SELECT_CLUSTERING_RESULTS": //6
        return <SelectClusteringResults context={state.context} send={send} />;
      case "EDIT_NEURAL_NETWORK_PARAMS": //7
        return <EditNeuralNetworkParams context={state.context} send={send} />;
      case "NEURAL_NETWORK_RESULTS": //8
        return <NeuralNetworkResult context={state.context} send={send} />;
      default:
        return null;
    }
  };

  const handleSaveTitle = (newTitle) => {
    console.log("Nuevo título guardado:", newTitle);

    dispatch(setName(newTitle));
  };

  return (
    <StyledExperienceContainer>
      <ExperienceHeader>
        <EditableTitle
          initialTitle='Nuevo entrenamiento'
          onSave={handleSaveTitle}
        />
        <p>27 de octubre de 2024, 20:33</p>
        <SecondaryButton SVG={NewExperienceIcon} text={"Nueva experiencia"} />
      </ExperienceHeader>
      <ExperienceContent>{renderState()}</ExperienceContent>
    </StyledExperienceContainer>
  );
};

export default ExperienceContainer;
