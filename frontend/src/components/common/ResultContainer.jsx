import styled from "styled-components";

// Components
import SvgButton from "./SvgButton";
import Base64Image from "./Base64Image";

// Icons
import InfoIcon from "../../assets/svg/icon-info.svg?react";

const StyledResultContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isChecked",
})`
  display: flex;
  // max-width: 18rem;
  background-color: var(--white);
  flex-direction: column;
  align-items: flex-start;
  border-radius: 10px;
  border: 2px solid var(--dark-800);
  cursor: pointer;
  transition: border 0.3s ease, background-color 0.3s ease;
  box-shadow: ${({ isChecked }) =>
    isChecked
      ? "5px 5px 10px rgba(0, 0, 0, 0.3)"
      : "3px 3px 5px rgba(0, 0, 0, 0.1)"};

  & > div:first-child {
    background-color: ${({ isChecked }) =>
      isChecked ? "var(--dark-800)" : "var(--white)"};
  }

  span,
  svg {
    color: ${({ isChecked }) =>
      isChecked ? "var(--white)" : "var(--dark-800)"};
  }

  &:hover {
    & > div:first-child {
      background-color: ${({ isChecked }) =>
        isChecked ? "var(--dark-500)" : "var(--dark-200)"};
    }
  }

  &:active {
    & > div:first-child {
      background-color: ${({ isChecked }) =>
        isChecked ? "var(--dark-300)" : "var(--dark-400)"};

      span,
      svg {
        color: ${({ isChecked }) =>
          isChecked ? "var(--dark-800)" : "var(--white)"};
      }
    }
  }

  &:focus {
    outline: none;
  }
`;

const ResultHeader = styled.div`
  display: flex;
  padding-left: 10px;
  align-items: center;
  align-self: stretch;
  justify-content: space-between;
  border-radius: 8px 8px 0px 0px;
  border-bottom: 2px solid var(--dark-800, #2d3648);

  span {
    font-feature-settings: "calt" off;
    font-family: Inter;
    font-size: 14px;
    font-weight: 700;
    line-height: 170%;
    letter-spacing: -0.14px;
  }
`;

const ResultContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4px;
  align-self: stretch;
  aspect-ratio: 4 / 3;
`;

const ResultContainer = ({
  handleClickInfo,
  handleSelect,
  title,
  checked,
  base64Image,
}) => {
  const toggleSelection = () => {
    handleSelect(title, !checked);
  };

  return (
    <StyledResultContainer
      onClick={toggleSelection}
      isChecked={checked}
      role='checkbox'
      aria-checked={checked}
      tabIndex='0' // Hacer el contenedor accesible con el teclado
    >
      <ResultHeader>
        <span>{title}</span>
        <SvgButton SvgIcon={InfoIcon} onClick={handleClickInfo} />
      </ResultHeader>
      <ResultContent>
        <Base64Image title={title} base64Image={base64Image} />
      </ResultContent>
    </StyledResultContainer>
  );
};

export default ResultContainer;
