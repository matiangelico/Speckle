import styled from "styled-components";

import { useState } from "react";

//Redux
import { useDispatch } from "react-redux";
import { createNotification } from "../../../reducers/notificationReducer";
import { showConfirmationAlertAsync } from "../../../reducers/alertReducer";
import { initializeRequestResult } from "../../../reducers/requestReducer";

//Commons
import PrimaryButton from "../../common/PrimaryButton";
import SecondaryButton from "../../common/SecondaryButton";
import ResultContainer from "../../common/ResultContainer";
import Loader from "../../common/Loader";

//Utils
import ResultModal from "../ExperienceUtils/ResultModal";

//Icons
import IconBrain from "../../../assets/svg/icon-brain.svg?react";
import ArrowLeftIcon from "../../../assets/svg/icon-arrow-left.svg?react";

//Hooks
import useToken from "../../../Hooks/useToken";

const DescriptorResultsContainer = styled.div`
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

const SelectDescriptorsResults = ({
  send,
  descriptorsResults,
  result,
  video,
}) => {
  const dispatch = useDispatch();
  const { token, loading: tokenLoading } = useToken();
  const [isLoading, setIsLoading] = useState(false);
  const [modalInfo, setModalInfo] = useState(null);

  const handleBack = () => {
    send({ type: "BACK" });
  };

  const generateRequestResult = async () => {
    setIsLoading(true);
    try {
      await dispatch(initializeRequestResult(token));
      send({ type: "NEXT" });
      dispatch(
        createNotification(`Resultado generado correctamente.`, "success")
      );
      setIsLoading(false);
    } catch (error) {
      console.error("Error al procesar la petición:", error);
      dispatch(
        createNotification(
          `Ha ocurrido un error vuelve a intentarlo mas tarde.`,
          "error"
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    if (!tokenLoading && token) {
      if (result !== null) {
        const answer = await dispatch(
          showConfirmationAlertAsync({
            title: `Realizar consulta`,
            message:
              "Ya has realizado la consulta anteriormente. ¿Deseas volver a generar un nuevo resultado? Se sobreescribira el resultado anteriormente calculado.",
          })
        );

        if (answer) {
          generateRequestResult();
        } else {
          send({ type: "NEXT" });
        }
      } else {
        generateRequestResult();
      }
    }
  };

  const openModal = (image, title, id) => {
    setModalInfo({ image, title, token, type: "descriptor", id });
  };

  const closeModal = () => {
    setModalInfo(null);
  };

  return (
    <>
      {isLoading ? (
        <div className='steps-container'>
          <Loader stepTitle='Realizando predicción del modelo' />
        </div>
      ) : (
        <>
          <div className='steps-container'>
            <h2>4. Resultados de descriptores para la consulta</h2>
            <h3>
              Revise los resultados generados por los descriptores utilizados en
              el entrenamiento utilizando como parametro el video insertado como
              parte de la consulta.
            </h3>
          </div>

          <DescriptorResultsContainer>
            {descriptorsResults.map((result, index) => (
              <ResultContainer
                key={index}
                title={result.name}
                checked={true}
                base64Image={result.image}
                handleClickInfo={() =>
                  openModal(result.image, result.name, result.id)
                }
                editable={false}
              />
            ))}
          </DescriptorResultsContainer>

          <div className='two-buttons-container'>
            <SecondaryButton
              handleClick={handleBack}
              SVG={ArrowLeftIcon}
              text={"Hiperparametros utilizados"}
            />

            <PrimaryButton
              handleClick={handleNext}
              RightSVG={IconBrain}
              text={"Realizar consulta"}
            />
          </div>

          <ResultModal
            image={modalInfo?.image}
            title={modalInfo?.title}
            isOpen={!!modalInfo}
            onClose={closeModal}
            token={modalInfo?.token}
            type={modalInfo?.type}
            methodId={modalInfo?.id}
            videoWidth={video?.width}
            videoHeight={video?.height}
            areThreeBtn={true}
          />
        </>
      )}
    </>
  );
};

export default SelectDescriptorsResults;
