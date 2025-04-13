import { useState } from "react";

//Redux
import { useDispatch } from "react-redux";
import {
  setNeuralNetworkLayers,
  initializeTrainingResult,
  changeToJSONTrainingResult,
} from "../../../reducers/trainingReducer";
import { createNotification } from "../../../reducers/notificationReducer";

//Components
import PrimaryButton from "../../common/PrimaryButton";
import SecondaryButton from "../../common/SecondaryButton";
import Loader from "../../common/Loader";

//Icons
import IconDumbbel from "../../../assets/svg/icon-dumbbel.svg?react";
import ArrowLeftIcon from "../../../assets/svg/icon-arrow-left.svg?react";
import AddLayerIcon from "../../../assets/svg/icon-lus-circle.svg?react";
import RemoveLayerIcon from "../../../assets/svg/icon-divide-circle.svg?react";

//Utils
import NeuralNetworkEditor from "../ExperienceUtils/NeuralNetworkEditor";

//Hooks
import useToken from "../../../Hooks/useToken";

const EditNeuralNetworkLayers = ({
  selectedDescriptors = 0,
  send,
  layerTemplate,
  layers,
  nroClusters = 0,
  clusteringJSON,
}) => {
  const dispatch = useDispatch();
  const { token, loading: tokenLoading } = useToken();
  const [isLoading, setIsLoading] = useState(false);

  console.log("selectedDescriptors", selectedDescriptors);
  console.log("nroClusters", nroClusters);

  const handleBack = () => {
    send({ type: "BACK" });
  };

  const handleNext = async () => {
    if (!tokenLoading && token) {
      setIsLoading(true);

      try {
        if (clusteringJSON !== null) {
          await dispatch(changeToJSONTrainingResult(token));
        } else {
          await dispatch(initializeTrainingResult(token));
        }
        send({ type: "NEXT" });
        dispatch(createNotification(`Red entrenada correctamente.`, "success"));
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

  const handleAddLayer = () => {
    const updatedLayers = [...layers, layerTemplate];

    dispatch(setNeuralNetworkLayers(updatedLayers));
  };

  const handleRemoveLayer = () => {
    if (layers.length > 1) {
      dispatch(setNeuralNetworkLayers(layers.slice(0, -1)));
    } else {
      dispatch(createNotification("La cantidad minima de capaz es uno."));
    }
  };

  const handleUpdateLayer = (index, field, value) => {
    const newLayers = layers.map((layer, i) =>
      i === index ? { ...layer } : layer
    );

    switch (field) {
      case "neurons":
        newLayers[index][field] = Math.min(value, 128);
        break;
      case "batchNorm":
        newLayers[index][field] = !newLayers[index][field];
        break;
      case "dropout":
        newLayers[index][field] =
          value === "" ? 0 : Math.min(Math.max(value, 0), 1);
        break;
      default:
        break;
    }

    dispatch(setNeuralNetworkLayers(newLayers));
  };

  return (
    <>
      {isLoading ? (
        <div className='steps-container'>
          <Loader stepTitle='Entrenando red neuronal' />
        </div>
      ) : (
        <>
          <div className='steps-container'>
            <h2>9. Editar capas de la red neuronal</h2>
            <h3>
              Configure la arquitectura de la red neuronal ajustando la cantidad
              de capas, el número de neuronas por capa y parámetros como batch
              normalization y dropout.
            </h3>
          </div>

          <NeuralNetworkEditor
            selectedDescriptors={selectedDescriptors}
            layers={layers}
            updateLayer={handleUpdateLayer}
            nroClusters={nroClusters}
          />

          <div className='two-buttons-container'>
            <SecondaryButton
              handleClick={handleBack}
              SVG={ArrowLeftIcon}
              text='Editar parámetros de la red neuronal'
            />

            <PrimaryButton
              text='Agregar Capa'
              LeftSVG={AddLayerIcon}
              handleClick={handleAddLayer}
            />
            <PrimaryButton
              text='Eliminar Capa'
              LeftSVG={RemoveLayerIcon}
              handleClick={handleRemoveLayer}
            />

            <PrimaryButton
              handleClick={handleNext}
              RightSVG={IconDumbbel}
              text='Entrenar red neuronal'
            />
          </div>
        </>
      )}
    </>
  );
};

export default EditNeuralNetworkLayers;
