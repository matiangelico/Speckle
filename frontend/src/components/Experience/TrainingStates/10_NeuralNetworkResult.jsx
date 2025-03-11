import styled from "styled-components";

import { useState } from "react";

//Redux
import { useDispatch } from "react-redux";
import { createNotification } from "../../../reducers/notificationReducer";
import { showConfirmationAlertAsync } from "../../../reducers/alertReducer";
import { saveTraining } from "../../../reducers/savedTrainingsReducer";

//Components
import ResultContainer from "../../common/ResultContainer";
import PrimaryButton from "../../common/PrimaryButton";
import SecondaryButton from "../../common/SecondaryButton";
import Loader from "../../common/Loader";

//Utils
import ResultModal from "../Utils/ResultModal";
import { convertToTimestamp } from "../../../utils/dateUtils";

//Icons
import ArrowLeftIcon from "../../../assets/svg/icon-arrow-left.svg?react";
import SaveIcon from "../../../assets/svg/icon-save.svg?react";

//Hooks
import useToken from "../../../Hooks/useToken";

const CenterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: min-content;
  overflow-y: auto;

  img {
    max-width: 602px;
    max-height: 100%;
  }

  @media (min-height: 900px) {
    height: 100%;
  }
`;

const NeuralNetworkResult = ({ send, training, chekedDescriptors }) => {
  const dispatch = useDispatch();
  const { token, loading: tokenLoading } = useToken();
  const [isLoading, setIsLoading] = useState(false);
  const [modalInfo, setModalInfo] = useState(null);

  const result = training.trainingResult;
  const trainingName = training.name;

  const handleBack = () => {
    send({ type: "BACK" });
  };

  const handleSaveTraining = async () => {
    const answer = await dispatch(
      showConfirmationAlertAsync({
        title: `Guardar entrenamiento`,
        message:
          "¿Estás seguro de que deseas guardar este entrenamiento? Al hacerlo, el proceso se reiniciará y comenzaras un nuevo entrenamiento.",
      })
    );

    if (!answer) {
      return;
    }

    if (!tokenLoading && token) {
      setIsLoading(true);

      const newTraining = {
        name: trainingName,
        date: convertToTimestamp(training.createdAt),
        video: {
          name: training.video.file.name,
          width:  training.video?.width,
          height: training.video?.height,
          frames:  training.video?.frames,
        },
        selectedDescriptors: chekedDescriptors.map((d) => {
          return {
            id: d.id,
            params: d.hyperparameters,
          };
        }),
      };

      console.log("newTraining", newTraining);

      try {
        await dispatch(saveTraining(token, newTraining));

        dispatch(
          createNotification(`Experiencia guardada correctamente.`, "success")
        );
        // send({ type: "RESET" });
      } catch (error) {
        console.error("Error al procesar la petición:", error);
        dispatch(
          createNotification(
            `Ha ocurrido un error vuelve a intentarlo.`,
            "error"
          )
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const openModal = (image, title) => {
    setModalInfo({ image, title });
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
            <h2>
              9. Visualizar resultado del entrenamiento de la red neuronal
            </h2>
            <h3>
              Visualice los resultados finales del entrenamiento de la red
              neuronal. Además de poder ampliar la imagen, descargar la matriz
              resultante o imprimir la imagen, tendrá la opción de guardar el
              entrenamiento para futuras consultas. Para iniciar un nuevo ciclo
              de entrenamiento, simplemente presione el botón “Nuevo
              entrenamiento”.
            </h3>
          </div>

          {result && (
            <CenterContainer>
              <ResultContainer
                title={trainingName}
                checked={false}
                base64Image={result.image}
                handleClickInfo={() => openModal(result.image, trainingName)}
              />
            </CenterContainer>
          )}

          <div className='two-buttons-container'>
            <SecondaryButton
              className='content'
              handleClick={handleBack}
              SVG={ArrowLeftIcon}
              text={"Editar capas de la red neuronal"}
            />

            <PrimaryButton
              className='content'
              handleClick={handleSaveTraining}
              RightSVG={SaveIcon}
              text={"Guardar entrenamieto"}
            />
          </div>

          <ResultModal
            image={modalInfo?.image}
            title={modalInfo?.title}
            isOpen={!!modalInfo}
            onClose={closeModal}
          />
        </>
      )}
    </>
  );
};

export default NeuralNetworkResult;
