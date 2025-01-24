import styled from "styled-components";

const StyledPrimaryButton = styled.button`
  position: relative;
  display: flex;
  padding: 12px 20px;
  justify-content: center;
  align-items: center;
  gap: 8px;

  border-radius: 8px;
  background: var(--dark-800);
  color: var(--white, #fff);
  font-family: Inter, sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  border: 2px solid var(--dark-800);
  cursor: pointer;
  overflow: hidden;
  transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;

  &:hover {
    background: var(--dark-500); /* Fondo más claro al pasar el mouse */
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2); /* Sombra al pasar el mouse */
    transform: translateY(-2px); /* Levantamiento sutil */
  }

  &:focus {
    outline: 2px solid var(--primary, #007bff); /* Enfasis visual en el botón */
    outline-offset: 2px;
  }

  &:active {
    background: var(--dark-900); /* Fondo más oscuro al hacer clic */
    transform: translateY(1px); /* Efecto de presionado */
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
  }

  &:disabled {
    background: var(--dark-400, #888);
    color: var(--dark-200, #ccc);
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }

  /* Efecto de animación */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 0%;
    height: 100%;
    background: rgba(255, 255, 255, 0.1); /* Fondo translúcido */
    transition: width 1s ease; /* Animación de expansión */
    z-index: 1;
  }

  &:hover::before {
    width: 100%; /* Expande el fondo animado al pasar el mouse */
  }

  & > span {
    position: relative;
    z-index: 2; /* Asegura que el texto esté encima del fondo animado */
  }
`;

const StyledText = styled.span`
  color: inherit; /* Asegura que use el color del botón */
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: -0.18px;
  text-transform: none;
`;

const PrimaryButton = ({ handleClick, LeftSVG = null, RightSVG = null, text, disabled, ariaLabel }) => {
  return (
    <StyledPrimaryButton
      onClick={handleClick}
      disabled={disabled}
      aria-label={ariaLabel || text}
      >
      {LeftSVG && <LeftSVG />}
      <StyledText>{text}</StyledText>
      {RightSVG && <RightSVG />}
    </StyledPrimaryButton>
  );
};

export default PrimaryButton;

{/* <PrimaryButton
  text="Iniciar sesión"
  handleClick={() => console.log("Clic en el botón")}
  SVG={MyIcon} // Opcional: ícono SVG
  disabled={false}
  ariaLabel="Iniciar sesión en el sistema"
/> */}