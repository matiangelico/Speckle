import { styled } from "styled-components";

const StyledPrimaryButton = styled.button`
  display: flex;
  padding: 12px 16px 12px 24px;
  justify-content: center;
  align-items: center;
  gap: 8px;

  border-radius: 6px;
  background: var(--dark-800);
`;

const StyledText = styled.span`
  color: var(--white, #fff);
  font-feature-settings: "calt" off;

  /* WF Buttons/Button Large */
  font-family: Inter;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px; /* 133.333% */
  letter-spacing: -0.18px;
`;

const PrimaryButton = ({ SVG, text }) => {
  return (
    <StyledPrimaryButton>
      <StyledText>{text}</StyledText>
      {SVG && <SVG />}
    </StyledPrimaryButton>
  );
};

export default PrimaryButton;
