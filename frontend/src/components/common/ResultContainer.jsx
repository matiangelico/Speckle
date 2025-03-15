import styled from "styled-components";

// Components
import SvgButton from "./SvgButton";
import Base64Image from "./Base64Image";

// Icons
import InfoIcon from "../../assets/svg/icon-info.svg?react";

const StyledResultContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isChecked" && prop !== "editable",
})`
  display: flex;
  background-color: var(--white);
  flex-direction: column;
  align-items: flex-start;
  border-radius: 10px;
  border: 2px solid var(--dark-800);
  cursor: ${({ editable }) => (editable ? "pointer" : "default")};
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
  p,
  svg {
    color: ${({ isChecked }) =>
      isChecked ? "var(--white)" : "var(--dark-800)"};
  }

  &:hover {
    & > div:first-child {
      background-color: ${({ isChecked, editable }) =>
        editable
          ? isChecked
            ? "var(--dark-500)"
            : "var(--dark-200)"
          : isChecked
          ? "var(--dark-800)"
          : "var(--white)"};
    }
  }

  &:active {
    & > div:first-child {
      background-color: ${({ isChecked }) =>
        isChecked ? "var(--dark-300)" : "var(--dark-400)"};

      span,
      p,
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

const ResultHeader = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "childCount",
})`
  display: grid;
  padding-left: 10px;
  align-items: center;
  align-self: stretch;
  justify-content: space-between;
  gap: 6px;
  border-radius: 8px 8px 0px 0px;
  border-bottom: 2px solid var(--dark-800, #2d3648);

  grid-template-columns: ${({ childCount }) =>
    childCount === 2 ? "1fr auto" : childCount === 3 ? "auto 1fr auto" : "1fr"};

  span {
    font-feature-settings: "calt" off;
    font-family: Inter;
    font-size: 14px;
    font-weight: 700;
    line-height: 170%;
    letter-spacing: -0.14px;
  }

  p {
    color: var(--dark-400);
    font-feature-settings: "calt" off;
    font-size: 0.8rem;
    font-style: normal;
    font-weight: 500;
    line-height: 150%;
    letter-spacing: -0.01rem;
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
  subtitle,
  checked,
  base64Image,
  editable = true,
}) => {
  const toggleSelection = () => {
    if (!editable) return;
    if (handleSelect) {
      handleSelect(title, !checked);
    }
  };

  return (
    <StyledResultContainer
      onClick={toggleSelection}
      isChecked={checked}
      editable={editable}
      role="checkbox"
      aria-checked={checked}
      tabIndex="0" // Hace el contenedor accesible con el teclado
    >
      <ResultHeader childCount={subtitle ? 3 : 2}>
        <span>{title}</span>
        {subtitle && <p>{subtitle} clusters</p>}
        <SvgButton SvgIcon={InfoIcon} onClick={handleClickInfo} />
      </ResultHeader>
      <ResultContent>
        <Base64Image title={title} base64Image={base64Image} />
      </ResultContent>
    </StyledResultContainer>
  );
};

export default ResultContainer;
