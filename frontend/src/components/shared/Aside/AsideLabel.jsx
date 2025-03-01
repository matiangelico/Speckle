import { styled } from "styled-components";

const StyledTimeItem = styled.time`
  display: flex;
  padding: 0.75rem 1rem;
  align-items: flex-start;
  gap: 0.625rem;
  align-self: stretch;

  /* Cambio de color para mejorar el contraste y la accesibilidad */
  strong {
    color: var(--dark-600); /* Ajuste de color más contrastante */
    font-family: Inter, sans-serif;
    font-size: 0.75rem; /* Ajuste del tamaño de la fuente para mejor legibilidad */
    font-style: normal;
    font-weight: 600;
    line-height: 1.4;
    letter-spacing: 0.1rem; /* Aumento de espaciado para mejorar la legibilidad */
    transition: color 0.3s ease; /* Añadido para suavizar el cambio de color */
  }

  &:hover strong {
    color: var(--dark-400); /* Cambio de color en hover para interacción visual */
  }

  &:focus-within strong {
    color: var(--primary-color); /* Indica foco en el componente */
  }
`;

const TimeItem = ({ text }) => {
  return (
    <StyledTimeItem>
      <strong>{text}</strong>
    </StyledTimeItem>
  );
};

export default TimeItem;
