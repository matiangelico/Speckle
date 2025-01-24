import styled from "styled-components";

// Estilos para el botón
const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  background: none;
  justify-content: center;
  padding: 10px 15px;  // Aumenté el padding para mejorar la interactividad
  color: var(--dark-600);
  border: none;
  border-radius: 8px 10px 0px 8px;
  cursor: pointer;

  &:hover {
    color: var(--dark-400);
  }

  // &:focus {
  //   outline: 3px solid #0056b3;
  // }

  &:active {
    color: var(--dark-800);
  }

  @media (max-width: 768px) {
    padding: 12px 24px;
  }
`;

const SvgButton = ({ SvgIcon, onClick, ariaLabel }) => {
  const handleClick = (event) => {
    event.stopPropagation();
    onClick(); // Llama a la función pasada en props
  };

  return (
    <StyledButton onClick={handleClick} aria-label={ariaLabel}>
      <SvgIcon />
    </StyledButton>
  );
};

export default SvgButton;
