import { styled } from "styled-components";

import { useEffect } from "react";

// Maquina de estados
import { useMachine } from "@xstate/react";
import RequestMachine from "../../machines/RequestMachine.jsx";

//Redux
import { useDispatch, useSelector } from "react-redux";
import {
  // resetRequest,
  // setName,
  initializeRequestAsync,
  resetRequest,
} from "../../reducers/requestReducer.jsx";
import { showConfirmationAlertAsync } from "../../reducers/alertReducer.jsx";

// Componentes de estado
import TrainingSelected from "./RequestStates/0_TrainingSelected.jsx";
import UploadVideo from "./RequestStates/1_UploadVideo.jsx";
import SelectDescriptors from "./RequestStates/2_SelectDescriptors.jsx";
import EditHyperparameters from "./RequestStates/3_EditHyperparameters.jsx";
import SelectDescriptorsResults from "./RequestStates/4_SelectDescriptorsResults.jsx";
import NeuralNetworkResult from "./RequestStates/10_NeuralNetworkResult.jsx";

// Commons
import EditableTitle from "../common/EditableTitle";
import SecondaryButton from "../common/SecondaryButton.jsx";

// Icons
import RefreshIcon from "../../assets/svg/icon-refresh-ccw.svg?react";

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

  &:has(:nth-child(2)) {
    grid-template-columns: auto 1fr;
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
    width: 20px;
    height: 20px;
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
  const [state, send] = useMachine(RequestMachine);
  const { token, loading: tokenLoading } = useToken();

  //0.
  const requestStatus = useSelector((state) => state.request.status);
  const trainingName = useSelector((state) => state.request.name);
  const createdAt = useSelector((state) => state.request.createdAt);
  const oldVideo = useSelector((state) => state.request.oldVideo);
  //1.
  const newVideo = useSelector((state) => state.request.newVideo);
  //2.
  const descriptors = useSelector((state) => state.request.descriptors);
  //3.
  const chekedDescriptors = descriptors.filter(
    (descriptor) => descriptor.checked
  );
  // 10
  const request = useSelector((state) => state.request);

  useEffect(() => {
    if (!tokenLoading && token && requestStatus === "idle") {
      dispatch(initializeRequestAsync(token));
    }
  }, [tokenLoading, token, requestStatus, dispatch]);

  // Renderiza el estado actual
  const renderState = () => {
    switch (state.value) {
      case "TRAINING_SELECTED": //0
        return <TrainingSelected send={send} video={oldVideo} />;
      case "UPLOAD_VIDEO": //1
        return <UploadVideo send={send} video={newVideo} />;
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
      case "NEURAL_NETWORK_RESULTS": //10
        return (
          <NeuralNetworkResult
            send={send}
            training={request}
            chekedDescriptors={chekedDescriptors}
          />
        );
      default:
        return null;
    }
  };

  const handleReset = async () => {
    const answer = await dispatch(
      showConfirmationAlertAsync({
        title: "Reiniciar consulta",
        message:
          "¿Deseas reiniciar la consulta actual?\nAl hacerlo, se perderá todo el progreso actual.",
      })
    );

    if (!answer) {
      return;
    }

    //Request Reducer
    dispatch(resetRequest());
    if (!tokenLoading && token) {
      dispatch(initializeRequestAsync(token));
    }
    //State Machine
    send({ type: "RESET" });
  };

  return (
    <StyledExperienceContainer>
      <ExperienceHeader>
        <EditableTitle initialTitle={trainingName} isEditable={false} />
        {createdAt ? <p>{convertToReadableDateAndHour(createdAt)}</p> : <p> </p>}
        <SecondaryButton
          SVG={RefreshIcon}
          text={"Reiniciar consulta"}
          handleClick={handleReset}
        />
      </ExperienceHeader>
      <ExperienceContent>{renderState()}</ExperienceContent>
    </StyledExperienceContainer>
  );
};

export default TrainingContainer;
