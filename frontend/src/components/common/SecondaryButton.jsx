import styled from "styled-components";

const StyledSecondaryButton = styled.button`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: 2px solid var(--dark-800, #4741d7); /* Tamaño y color del borde */
  border-radius: 8px;
  background-color: var(--white, #ffffff); /* Fondo blanco inicial */
  color: var(--dark-800, #4741d7); /* Color del texto inicial */
  font-family: Inter, sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  overflow: hidden; /* Para ocultar la animación que exceda los bordes */
  z-index: 1;
  transition: color 0.3s ease;

  svg {
    color: inherit;
    transition: color 0.1s linear;
  }

  /* Fondo animado */
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--dark-800, #4741d7); /* Color del fondo en hover */
    z-index: -1; /* Coloca el fondo detrás del texto */
    transform: scale(0, 0); /* Escala inicial (oculto) */
    transition: transform 0.3s ease, background-color 0.3s ease;
  }

  /* Efecto hover */
  &:hover {
    color: var(--white, #ffffff); /* Cambia el color del texto a blanco */
    svg {
      color: var(--white, #ffffff); /* Cambia el color del ícono a blanco */
    }

    &::after {
      transform: scale(1, 1); /* Escala completa al pasar el mouse */
    }
  }

  /* Enfoque para accesibilidad */
  &:focus {
    outline: 2px solid var(--primary, #007bff); /* Borde visible en foco */
    outline-offset: 2px;
  }

  /* Estado activo (clic) */
  &:active {
    transform: scale(0.98); /* Pequeña reducción en tamaño al clic */
  }

  /* Estado deshabilitado */
  &:disabled {
    background-color: var(--dark-100, #f5f5f5);
    border-color: var(--dark-300, #cccccc);
    color: var(--dark-400, #aaaaaa);
    cursor: not-allowed;
    &::after {
      background-color: transparent;
    }
  }
`;

const StyledText = styled.span`
  color: inherit; /* Usa el color definido en el botón */
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: -0.16px;
`;

const SecondaryButton = ({ SVG, text, handleClick, disabled, type, ariaLabel }) => {
  return (
    <StyledSecondaryButton
      onClick={handleClick}
      disabled={disabled}
      type={type || "button"}
      aria-label={ariaLabel || text}
    >
      {SVG && <SVG />}
      <StyledText>{text}</StyledText>
    </StyledSecondaryButton>
  );
};

export default SecondaryButton;

{
  /* <SecondaryButton
  text="Cancelar"
  handleClick={() => console.log("Clic en el botón secundario")}
  SVG={MyIcon} // Opcional: ícono SVG
  disabled={false}
  ariaLabel="Cancelar operación"
/> */
}
