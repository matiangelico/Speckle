import { styled } from "styled-components";

// Icons
import LogOutIcon from "../../../assets/svg/icon-log-out.svg?react";

const StyledAsideLogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 0.75rem 1.5rem;
  border: none;
  background: transparent;
  color: var(--dark-800);
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
  position: relative;
  text-decoration: none;

  &:focus {
    outline: 3px solid var(--primary-color);
    outline-offset: 2px;
  }

  &:hover,
  &:focus {
    background-color: var(--dark-200);
    color: var(--dark-600);
  }

  &:active {
    background-color: var(--dark-300);
    color: var(--dark-800);
  }

  svg {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
    fill: currentColor;
    transition: color 0.3s ease, fill 0.3s ease;
  }

  p {
    margin: 0;
    font-family: Inter, sans-serif;
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 500;
    text-align: left;
    line-height: 1.5rem;
    letter-spacing: -0.00875rem;
    color: inherit;
    flex: 1;
    transition: color 0.3s ease;
  }
`;

const AsideButton = ({ onClick }) => {
  return (
    <StyledAsideLogoutButton onClick={onClick}>
      <div>
        <LogOutIcon />
      </div>
      <p>Cerrar sesión</p>
    </StyledAsideLogoutButton>
  );
};

export default AsideButton;
