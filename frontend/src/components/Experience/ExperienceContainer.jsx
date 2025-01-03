import { styled } from "styled-components";

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

// Maquina de estados
import { useMachine } from "@xstate/react";
import TrainingMachine from "../../machines/trainingMachine";

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

// Icons
import NewExperienceIcon from "../../assets/svg/icon-lus-circle.svg?react";
import { initializeDescriptors } from '../../reducers/trainingReducer';


const StyledExperienceContainer = styled.main`
  display: grid;
  grid-template-rows: auto 0.95fr;
`;

const ExperienceHeader = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  /* width: 78.25rem; */
  padding: 1.2rem 3rem;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  border-bottom: 2px solid var(--dark-500);

  h1 {
    color: var(--dark-800);
    font-size: 1.8rem;
    font-style: normal;
    font-weight: 700;
    line-height: 130%; /* 2.6rem */
  }

  p {
    color: var(--dark-400);
    font-feature-settings: "calt" off;

    /* WF Body/Body Medium */
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
    line-height: 150%; /* 1.5rem */
    letter-spacing: -0.01rem;
  }
`;

const ExperienceContent = styled.div`
  display: grid;
  grid-template-rows: auto 0.95fr auto;
  padding: 1.2rem 3rem 1.2rem 3rem;
  gap: 1rem;

  .steps-container {
    display: flex;
    /* padding: 0rem 1.25rem; */
    flex-direction: column;
    align-items: flex-start;
    align-self: stretch;
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

  return (
    <StyledExperienceContainer>
      <ExperienceHeader>
        <h1>Contenido Principal</h1>
        <p>27 de octubre de 2024, 20:33</p>
        <SecondaryButton SVG={NewExperienceIcon} text={"Nueva experiencia"} />
      </ExperienceHeader>
      <ExperienceContent>{renderState()}</ExperienceContent>
    </StyledExperienceContainer>
  );
};

export default ExperienceContainer;
