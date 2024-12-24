import { styled } from "styled-components";

const StyledAsideItem = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 0.75rem 2.5rem;
  border: none;
  background: transparent;
  color: ${({ isActive }) =>
    isActive ? "var(--dark-800)" : "var(--dark-300)"};
  cursor: pointer;
  transition: background-color 0.1s linear, color 0.1s linear;

  &:hover {
    background-color: var(--dark-200);
    color: var(--dark-600); /* Cambia color en hover */
  }

  &:active {
    background-color: var(--dark-200);
    color: var(--dark-800); /* Cambia color en active */
  }

  svg {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
    fill: currentColor; /* Hereda el color dinámico del texto */
    transition: color 0.3s ease, fill 0.3s ease; /* Transición para suavidad */
  }

  p {
    font-feature-settings: "calt" off;
    font-family: Inter, sans-serif;
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 500;
    text-align: left;
    line-height: 1.5rem;
    letter-spacing: -0.00875rem;
    color: inherit; /* Hereda el color dinámico */
    flex: 1;
    transition: color 0.3s ease;
  }
`;

const AsideItem = ({ icon: Icon, title, isActive, handleClick }) => {
  return (
    <StyledAsideItem isActive={isActive} onClick={handleClick}>
      {Icon && <Icon />} {/* Renderiza el ícono si está definido */}
      <p>{title}</p>
    </StyledAsideItem>
  );
};

export default AsideItem;
