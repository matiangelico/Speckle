//Redux
import { useDispatch } from "react-redux";
import {
  setNeuralNetworkLayers,
  initializeTrainingResult,
} from "../../../reducers/trainingReducer";
import { createNotification } from "../../../reducers/notificationReducer";

//Components
import PrimaryButton from "../../common/PrimaryButton";
import SecondaryButton from "../../common/SecondaryButton";

//Icons
import IconDumbbel from "../../../assets/svg/icon-dumbbel.svg?react";
import ArrowLeftIcon from "../../../assets/svg/icon-arrow-left.svg?react";
import NeuralNetworkEditor from "../Utils/NeuralNetworkEditor";
import AddLayerIcon from "../../../assets/svg/icon-lus-circle.svg?react";
import RemoveLayerIcon from "../../../assets/svg/icon-divide-circle.svg?react";

const EditNeuralNetworkLayers = ({ send, layerTemplate, layers }) => {
  const dispatch = useDispatch();

  const handleBack = () => {
    send({ type: "BACK" });
  };

  const handleNext = () => {
    dispatch(initializeTrainingResult());

    send({ type: "NEXT" });
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
      <div className='steps-container'>
        <h2>9. Editar capas de la red neuronal</h2>
        <h3>
          Configure la arquitectura de la red neuronal ajustando la cantidad de
          capas, el número de neuronas por capa y parámetros como batch
          normalization y dropout.
        </h3>
      </div>

      <NeuralNetworkEditor layers={layers} updateLayer={handleUpdateLayer} />

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
  );
};

export default EditNeuralNetworkLayers;
