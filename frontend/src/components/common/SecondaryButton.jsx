import { styled } from "styled-components";

const StyledSecondaryButton = styled.button`
  display: flex;
  padding: 10px 16px;
  justify-content: center;
  align-items: center;
  gap: 8px;

  border-radius: 6px;
  border: 2px solid var(--dark-800, #2d3648);

  svg {
    color: var(--dark-800, #2d3648);
  }
`;

const StyledText = styled.span`
  color: var(--dark-800, #2d3648);
  font-feature-settings: "calt" off;

  /* WF Buttons/Button Medium */
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px; /* 150% */
  letter-spacing: -0.16px;
`;

const SecondaryButton = ({ SVG, text }) => {
  return (
    <StyledSecondaryButton>
      {SVG && <SVG />}
      <StyledText>{text}</StyledText>
    </StyledSecondaryButton>
  );
};

export default SecondaryButton;
