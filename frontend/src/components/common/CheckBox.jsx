import { useState } from "react";
import { styled } from "styled-components";

import CheckIcon from "../../assets/svg/icon-check.svg?react";

const StyledCheckbox = styled.label`
  display: inline-flex;
  padding: 12px 20px;
  align-items: center;
  gap: 10px;
  border-radius: 8px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: var(--dark-100);
  }

  input {
    appearance: none;
    width: 20px;
    height: 20px;
    border: 2px solid var(--dark-500);
    border-radius: 4px;
    background-color: var(--white);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    position: relative;
    transition: all 0.3s ease;

    &:checked {
      background-color: var(--dark-800);
      border-color: var(--dark-800);
    }

    &:focus {
      outline: none;
      border-color: var(--dark-500);
    }
  }

  svg {
    position: absolute;
    width: 20px;
    height: 20px;
    color: transparent;
    transition: fill 0.3s ease;
  }

  input:checked + svg {
    color: var(--white); /* Cambio de color del ícono cuando está marcado */
  }

  span {
    color: var(--dark-800);
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 170%;
  }
`;

const Checkbox = ({ label, checked, onChange }) => {
  return (
    <StyledCheckbox>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <CheckIcon />
      <span>{label}</span>
    </StyledCheckbox>
  );
};

// Uso del componente de checkbox con estado en el componente padre
const TaskCheckbox = ({ text }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <Checkbox
      label={text}
      checked={isChecked}
      onChange={handleCheckboxChange}
    />
  );
};

export default TaskCheckbox;
