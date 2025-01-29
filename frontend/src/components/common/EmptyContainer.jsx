import styled from "styled-components";

const StyledEmptyContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  pointer-events: none;

  border-radius: 8px;
  border: 2px dashed var(--dark-300, #cbd2e0);
  background: var(--white, #fff);

  span {
    color: var(--dark-400, #a0abc0);
    text-align: center;
    font-feature-settings: "calt" off;

    font-family: Inter;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
    letter-spacing: -0.16px;
  }
`;

const EmptyContainer = ({ message }) => {
  return (
    <StyledEmptyContainer>
      <span>{message}</span>
    </StyledEmptyContainer>
  );
};

export default EmptyContainer;
