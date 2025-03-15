import styled from "styled-components";

import { useState } from "react";

//Redux
import { useDispatch, useSelector } from "react-redux";
import { createNotification } from "../../../reducers/notificationReducer";
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

const SelectDescriptorsResults = ({ send }) => {
  const dispatch = useDispatch();
  const { token, loading: tokenLoading } = useToken();
  const [isLoading, setIsLoading] = useState(false);
  const descriptorsResults = useSelector(
    (state) => state.request.descriptorsResults
  );
  const [modalInfo, setModalInfo] = useState(null);

  const handleBack = () => {
    send({ type: "BACK" });
  };

  const handleNext = async () => {
    if (!tokenLoading && token) {
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
          <Loader />
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
                checked={result.checked}
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
              text={"Hiperparametros seleccionados"}
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
          />
        </>
      )}
    </>
  );
};

export default SelectDescriptorsResults;
