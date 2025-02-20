import styled from "styled-components";

import { useState } from "react";

//Redux
import { useDispatch } from "react-redux";
import {
  selectClustering,
  selectAllClustering,
  deselectAllClustering,
} from "../../../reducers/trainingReducer";
import { createNotification } from "../../../reducers/notificationReducer";

//Commons
import TaskCheckbox from "../../common/CheckBox";
import PrimaryButton from "../../common/PrimaryButton";
import SecondaryButton from "../../common/SecondaryButton";

//Icons
import ArrowRightIcon from "../../../assets/svg/icon-arrow-right.svg?react";
import ArrowLeftIcon from "../../../assets/svg/icon-arrow-left.svg?react";
import YesNoIcon from "../../../assets/svg/icon-yes-no.svg?react";

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
  const [allSelected, setAllSelected] = useState(false);

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

  const handleSelectAll = () => {
    dispatch(selectAllClustering());
    setAllSelected(true);
  };

  const handleDeselectAll = () => {
    dispatch(deselectAllClustering());
    setAllSelected(false);
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
          {clusteringAlgorithms.map((algorithm, index) => (
            <TaskCheckbox
              key={index}
              label={algorithm.name}
              checked={algorithm.checked}
              onChange={handleDescriptorSelected} // Actualiza el estado de "checked"
            />
          ))}
        </StyledDescriptorsContainer>
      )}

      <div className='two-buttons-container'>
        <SecondaryButton
          handleClick={handleBack}
          SVG={ArrowLeftIcon}
          text={"Seleccionar resultados de descriptores"}
        />

        {allSelected ? (
          <SecondaryButton
            handleClick={handleDeselectAll}
            SVG={YesNoIcon}
            text={"Deseleccionar todos"}
          />
        ) : (
          <PrimaryButton
            handleClick={handleSelectAll}
            LeftSVG={YesNoIcon}
            text={"Seleccionar todos"}
          />
        )}

        <PrimaryButton
          handleClick={handleNext}
          RightSVG={ArrowRightIcon}
          text={"Editar parametros de clustering"}
        />
      </div>
    </>
  );
};

export default SelectClusteringAlgorithms;
