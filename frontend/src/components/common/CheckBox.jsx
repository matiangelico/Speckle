import { styled } from "styled-components";

import CheckIcon from "../../assets/svg/icon-check.svg?react";

const StyledCheckbox = styled.label`
  position: relative;
  display: inline-flex;
  padding: 12px 20px;
  align-items: center;
  flex-direction: row;
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
    color: var(--white);
  }

  input:checked + & {
    background-color: var(--dark-600);
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
      <input id={label} type='checkbox' checked={checked} onChange={onChange} />
      <CheckIcon /> {/* El icono ahora está posicionado encima */}
      <span>{label}</span>
    </StyledCheckbox>
  );
};

const TaskCheckbox = ({ label, checked, onChange }) => {
  const handleCheckboxChange = () => {
    onChange(label, !checked);
  };

  return (
    <Checkbox label={label} checked={checked} onChange={handleCheckboxChange} />
  );
};

export default TaskCheckbox;
