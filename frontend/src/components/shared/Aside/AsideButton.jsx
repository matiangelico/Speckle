import { styled } from "styled-components";

import { useState, useRef, useEffect } from "react";

// Icons
import TrashIcon from "../../../assets/svg/icon-trash.svg?react";

const StyledAsideItem = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 0.75rem 1.5rem;
  border: none;
  background: transparent;
  color: ${(props) =>
    props["data-is-active"] ? "var(--dark-800)" : "var(--dark-300)"};
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
  position: relative;

  /* Estilo para el foco */
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
    font-feature-settings: "calt" off;
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

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
`;

const Tooltip = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 8px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 10;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--dark-200);

  /* Flecha del tooltip */
  &:after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 5px;
    border-style: solid;
    border-color: white transparent transparent transparent;
  }
`;

const DeleteButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 0;
  background: transparent;
  color: #e53935; /* Color rojo */
  cursor: pointer;
  border-radius: 50%;

  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(229, 57, 53, 0.1);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const AsideItem = ({
  icon: Icon,
  id,
  title,
  isActive,
  handleClick,
  onDelete,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef(null);
  const iconRef = useRef(null);

  const handleIconClick = (e) => {
    e.stopPropagation();
    setShowTooltip(!showTooltip);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(id, title);
    }
    setShowTooltip(false);
  };

  // Cerrar el tooltip al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target) &&
        iconRef.current &&
        !iconRef.current.contains(event.target)
      ) {
        setShowTooltip(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <StyledAsideItem
      role='button'
      aria-pressed={isActive ? "true" : "false"}
      data-is-active={isActive}
      onClick={handleClick}
    >
      {Icon && (
        <IconWrapper
          onClick={handleIconClick}
          ref={iconRef}
          aria-haspopup='true'
          aria-expanded={showTooltip}
        >
          <Icon />

          {showTooltip && (
            <Tooltip ref={tooltipRef}>
              <DeleteButton onClick={handleDeleteClick} aria-label='Eliminar'>
                <TrashIcon />
              </DeleteButton>
            </Tooltip>
          )}
        </IconWrapper>
      )}
      <p>{title}</p>
    </StyledAsideItem>
  );
};

export default AsideItem;
