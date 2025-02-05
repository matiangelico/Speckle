import styled from "styled-components";

import { useState, useEffect } from "react";

//Icons
import EditIcon from "../../assets/svg/icon-edit.svg?react";
import SvgButton from "./SvgButton";

const StyledTitle = styled.h1`
  color: var(--dark-800);
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 130%;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease-in-out;

  &:hover {
    opacity: 0.8;
  }
`;

const StyledInput = styled.input`
  color: var(--dark-800);
  width: min-content;
  font-size: 1.8rem;
  font-weight: 700;
  border: none;
  outline: none;
  background: transparent;
  padding: 5px 0;
  transition: border 0.1s ease-in-out;

  &:focus {
    border-bottom: 2px solid var(--dark-800);
  }
`;

const EditableTitle = ({ initialTitle, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [tempTitle, setTempTitle] = useState(initialTitle); // Guarda el título temporalmente

  useEffect(() => {
    setTitle(initialTitle);
    setTempTitle(initialTitle);
  }, [initialTitle]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setTempTitle(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (tempTitle.trim() !== "") {
      setTitle(tempTitle);
      onSave(tempTitle);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleBlur();
    }
    if (e.key === "Escape") {
      setIsEditing(false);
      setTempTitle(title); // Cancela cambios
    }
  };

  return (
    <>
      {isEditing ? (
        <StyledInput
          type='text'
          value={tempTitle}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <>
          <SvgButton
            SvgIcon={EditIcon}
            onClick={handleDoubleClick}
            ariaLabel='Edit name'
          />
          <StyledTitle onDoubleClick={handleDoubleClick}>{title}</StyledTitle>
        </>
      )}
    </>
  );
};

export default EditableTitle;
