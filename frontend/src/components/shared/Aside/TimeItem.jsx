import { styled } from "styled-components";

const StyledTimeItem = styled.div`
  display: flex;
  padding: 0.75rem 1rem;
  align-items: flex-start;
  gap: 0.625rem;
  align-self: stretch;
  pointer-events: none;

  strong {
    color: var(--dark-600);
    font-family: Inter;
    font-size: 0.6875rem;
    font-style: normal;
    font-weight: 500;
    line-height: 140%; /* 0.9625rem */
    letter-spacing: 0.06875rem;
  }
`;

const TimeItem = ({ text }) => {
  return (
    <StyledTimeItem>
      <strong>{text}</strong>
    </StyledTimeItem>
  );
};

export default TimeItem;
