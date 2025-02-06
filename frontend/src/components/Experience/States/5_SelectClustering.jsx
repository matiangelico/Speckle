import styled from "styled-components";

//Redux
import { useDispatch } from "react-redux";
import { selectClustering } from "../../../reducers/trainingReducer";
import { createNotification } from "../../../reducers/notificationReducer";

//Commons
import TaskCheckbox from "../../common/CheckBox";
import PrimaryButton from "../../common/PrimaryButton";
import SecondaryButton from "../../common/SecondaryButton";

//Icons
import ArrowRightIcon from "../../../assets/svg/icon-arrow-right.svg?react";
import ArrowLeftIcon from "../../../assets/svg/icon-arrow-left.svg?react";

const StyledDescriptorsContainer = styled.div`
  display: flex;
  align-items: center;
  align-content: flex-start;
  gap: 10px 10px;
  flex-shrink: 0;
  flex-wrap: wrap;
`;

const SelectClusteringAlgorithms = ({ send, clusteringAlgorithms }) => {
  const dispatch = useDispatch();

  const handleBack = () => {
    send({ type: "BACK" });
  };

  const handleNext = () => {
    const isAnyClusteringChecked = clusteringAlgorithms.some(
      (algorithm) => algorithm.checked
    );

    if (isAnyClusteringChecked) {
      send({ type: "NEXT" });
    } else {
      dispatch(
        createNotification(
          "Por favor, selecciona al menos un descriptor para continuar.",
          "error"
        )
      );
    }
  };

  const handleDescriptorSelected = (descriptorChanged) => {
    dispatch(selectClustering(descriptorChanged));
  };

  return (
    <>
      <div className='steps-container'>
        <h2>5. Seleccionar algoritmos de clustering</h2>
        <h3>
          Elija uno o más algoritmos de clustering que se aplicarán para agrupar
          los datos derivados del procesamiento de la imagen. La selección de
          estos algoritmos definirá la estructura del análisis subsiguiente.
        </h3>
      </div>

      {clusteringAlgorithms && (
        <StyledDescriptorsContainer>
          {clusteringAlgorithms.map((descriptor, index) => (
            <TaskCheckbox
              key={index}
              label={descriptor.name}
              checked={descriptor.checked}
              onChange={handleDescriptorSelected} // Actualiza el estado de "checked"
            />
          ))}
        </StyledDescriptorsContainer>
      )}

      <div className='two-buttons-container'>
        <SecondaryButton
          handleClick={handleBack}
          SVG={ArrowLeftIcon}
          text={"Subir video"}
        />

        <PrimaryButton
          handleClick={handleNext}
          RightSVG={ArrowRightIcon}
          text={"Seleccionar hiperparametros"}
        />
      </div>
    </>
  );
};

export default SelectClusteringAlgorithms;
