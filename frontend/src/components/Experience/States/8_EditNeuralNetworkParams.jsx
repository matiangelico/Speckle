import styled from "styled-components";

//Redux
import { useDispatch } from "react-redux";
import { updateNeuralNetworkParams } from "../../../reducers/trainingReducer";

// import { createNotification } from "../../../reducers/notificationReducer";

//Components
import Input from "../../common/Input";
import EmptyContainer from "../../common/EmptyContainer";
import PrimaryButton from "../../common/PrimaryButton";
import SecondaryButton from "../../common/SecondaryButton";

//Icons
import ArrowRightIcon from "../../../assets/svg/icon-arrow-right.svg?react";
import ArrowLeftIcon from "../../../assets/svg/icon-arrow-left.svg?react";
import TaskCheckbox from "../../common/CheckBox";

const NeuralNetworkParamsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  // justify-content: center;
  align-items: end;
  gap: 10px 10px;
  width: 100%;
  height: min-content;
  overflow-y: auto;

  @media (min-width: 1020px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1920px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (min-height: 900px) {
    gap: 20px;
  }
`;

const EditNeuralNetworkParams = ({ send, networkParams }) => {
  const dispatch = useDispatch();

  const handleBack = () => {
    send({ type: "BACK" });
  };

  const handleNext = () => {
    // ALGUNA VALIDACION DE HIPERPARAMETROS?
    send({ type: "NEXT" });
  };

  const handleChangeValue = (paramName, newValue) => {
    switch (paramName) {
      case "Épocas":
      case "Batch Size":
        dispatch(
          updateNeuralNetworkParams({
            parameterName: paramName,
            newValue: newValue,
          })
        );
        break;
      case "Early Stopping":
        {
          const actValue = networkParams.find(
            (param) =>
              param.name === "Early Stopping" && param.type === "checkbox"
          );

          dispatch(
            updateNeuralNetworkParams({
              parameterName: paramName,
              newValue: !actValue.value,
            })
          );
        }
        break;
      default:
        break;
    }
  };

  // const handleSetDefaultValues = () => {
  //   dispatch(resetClusteringParams());
  // };

  return (
    <>
      <div className='steps-container'>
        <h2>8. Editar parámetros de la red neuronal</h2>
        <h3>
          Configure la arquitectura de la red neuronal ajustando la cantidad de
          capas, el número de neuronas por capa y parámetros como batch
          normalization y dropout.
        </h3>
      </div>

      {networkParams.length > 0 ? (
        <NeuralNetworkParamsContainer>
          {networkParams.map((parameter, index) =>
            parameter.type === "number" ? (
              <Input
                key={index}
                primaryLabel={parameter.name}
                type="number"
                id={index}
                name={parameter.name}
                min={0}
                max={100}
                step={1}
                value={parameter.value}
                setValue={(newValue) =>
                  handleChangeValue(parameter.name, newValue)
                }
              />
            ) : (
              <TaskCheckbox
                key={index}
                label={parameter.name}
                checked={
                  parameter.value !== undefined ? parameter.value : false
                }
                onChange={(newValue) =>
                  handleChangeValue(parameter.name, newValue)
                }
              />
            )
          )}
        </NeuralNetworkParamsContainer>
      ) : (
        <EmptyContainer message='No parametros de la red neuronal editables.' />
      )}

      <div className='two-buttons-container'>
        <SecondaryButton
          handleClick={handleBack}
          SVG={ArrowLeftIcon}
          text='Seleccionar resultados de clustering'
        />

        <PrimaryButton
          handleClick={handleNext}
          RightSVG={ArrowRightIcon}
          text='Editar capas de la red neuronal'
        />
      </div>
    </>
  );
};

export default EditNeuralNetworkParams;
