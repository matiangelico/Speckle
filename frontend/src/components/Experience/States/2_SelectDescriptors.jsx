import styled from "styled-components";

import { useState } from "react";

//Redux
import { useDispatch } from "react-redux";
import {
  selectDescriptor,
  selectAllDescriptors,
  deselectAllDescriptors,
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

const SelectDescriptors = ({ send, descriptors }) => {
  const dispatch = useDispatch();
  const [allSelected, setAllSelected] = useState(false);

  const handleBack = () => {
    send({ type: "BACK" });
  };

  const handleNext = () => {
    const isAnyDescriptorChecked = descriptors.some(
      (descriptor) => descriptor.checked
    );

    if (isAnyDescriptorChecked) {
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
    dispatch(selectDescriptor(descriptorChanged));
  };

  const handleSelectAll = () => {
    dispatch(selectAllDescriptors());
    setAllSelected(true);
  };

  const handleDeselectAll = () => {
    dispatch(deselectAllDescriptors());
    setAllSelected(false);
  };

  return (
    <>
      <div className='steps-container'>
        <h2>2. Seleccionar descriptores</h2>
        <h3>
          Elija uno o más descriptores que se emplearán para extraer
          características relevantes del contenido del video. Estos descriptores
          determinarán la forma en que se procesará la imagen.
        </h3>
      </div>

      {descriptors && (
        <StyledDescriptorsContainer>
          {descriptors.map((descriptor, index) => (
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
          text={"Seleccionar hiperparametros"}
        />
      </div>
    </>
  );
};

export default SelectDescriptors;
