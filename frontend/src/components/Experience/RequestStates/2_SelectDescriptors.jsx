import styled from "styled-components";

//Redux
import { useDispatch } from "react-redux";
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

const SelectDescriptors = ({ send, descriptors }) => {
  const dispatch = useDispatch();

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
          "Por favor, selecciona al menos un descriptor para continuar."
        )
      );
    }
  };

  return (
    <>
      <div className='steps-container'>
        <h2>2. Descriptores utilizados</h2>
        <h3>
          A continuacion se muestran los detalles de los descriptores con los
          cuales procesado el video del entrenamiento.
        </h3>
      </div>

      {descriptors && (
        <StyledDescriptorsContainer>
          {descriptors.map((descriptor, index) => (
            <TaskCheckbox
              key={index}
              label={descriptor.name}
              checked={descriptor.checked}
              editable={false}
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

export default SelectDescriptors;
