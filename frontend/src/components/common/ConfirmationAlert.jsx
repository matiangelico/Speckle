import styled from "styled-components";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { hideConfirmationAlert } from "../../reducers/alertReducer";

// Components
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";

// Icons
import CrossIcon from "../../assets/svg/icon-x.svg?react";
import SvgButton from "./SvgButton";

const AlertOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const AlertContainer = styled.div`
  background: var(--white);
  border-radius: 8px;
  border: 3px solid var(--dark-800);
  width: 100%;
  max-width: 650px;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const AlertHeader = styled.div`
  display: flex;
  padding: 12px 18px;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  align-self: stretch;
  border-bottom: 3px solid var(--dark-800);

  button {
    padding: 4px;
  }

  svg {
    width: 32px;
    height: 32px;
  }
`;

const AlertContent = styled.div`
  display: flex;
  padding: 18px;
  flex-direction: column;
  align-items: flex-start;
  gap: 40px;
  align-self: stretch;

  button {
    width: 40%;
  }
`;

const Title = styled.h2`
  color: var(--dark-800);
  font-family: Inter, sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  // line-height: 130%;
  margin: 0;
`;

const Message = styled.p`
  color: var(--dark-600);
  font-family: Inter, sans-serif;
  font-feature-settings: "calt" off;
  font-style: normal;
  font-size: 1rem;
  line-height: 160%; /* 35.2px */
  margin-bottom: 24px;
  letter-spacing: -0.22px;
  font-weight: 400;
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 12px;
`;

const ConfirmationAlert = () => {
  const dispatch = useDispatch();
  const { isOpen, title, message, onConfirm, onCancel } = useSelector(
    (state) => state.confirmationAlert
  );

  if (!isOpen) return null;

  // Función para cerrar la alerta
  const handleClose = () => {
    if (typeof onCancel === "function") {
      onCancel();
    }
    dispatch(hideConfirmationAlert());
  };

  // Función para confirmar la acción y cerrar la alerta
  const handleConfirm = () => {
    if (typeof onConfirm === "function") {
      onConfirm();
    }
    dispatch(hideConfirmationAlert());
  };

  return (
    <AlertOverlay onClick={handleClose}>
      <AlertContainer onClick={(e) => e.stopPropagation()}>
        <AlertHeader>
          <Title>{title}</Title>
          <SvgButton
            SvgIcon={CrossIcon}
            onClick={handleClose}
            aria-label='Cerrar'
          />
        </AlertHeader>
        <AlertContent>
          <Message>{message}</Message>
          <ButtonContainer>
            <SecondaryButton
              text='Cancelar'
              handleClick={handleClose}
              ariaLabel='Cancelar acción'
            />
            <PrimaryButton
              text='Confirmar'
              handleClick={handleConfirm}
              ariaLabel='Confirmar acción'
            />
          </ButtonContainer>
        </AlertContent>
      </AlertContainer>
    </AlertOverlay>
  );
};

export default ConfirmationAlert;
