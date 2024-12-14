import { styled } from "styled-components";

const StyledfavItem = styled.button`
  display: flex;
  width: 100%;
  padding: 0.75rem 2.5rem;
  align-items: center;
  gap: 0.625rem;
  border: 0;
  color: var(--dark-300);

  &:hover {
    color: var(--dark-400);
    background-color: var(--dark-200);
  }

  &:active {
    color: var(--dark-500);
  }

  p {
    //flex: 1 0 0;
    font-feature-settings: "calt" off;
    font-family: Inter;
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 500;
    line-height: 1.5rem; /* 171.429% */
    letter-spacing: -0.00875rem;
  }
  

  svg {
    color: var(--dark-300);
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
  }
`;

const FavItem = ({ expTitle }) => {
  return (
    <StyledfavItem>
      <svg
        width='16'
        height='16'
        viewBox='0 0 16 16'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <g id='icon-more-horizontal'>
          <g id='Shape'>
            <path
              d='M3.33333 6.66666C2.59695 6.66666 2 7.26361 2 7.99999C2 8.73637 2.59695 9.33332 3.33333 9.33332C4.06971 9.33332 4.66667 8.73637 4.66667 7.99999C4.66667 7.26361 4.06971 6.66666 3.33333 6.66666Z'
              fill='#2D3648'
            />
            <path
              d='M6.66667 7.99999C6.66667 7.26361 7.26362 6.66666 8 6.66666C8.73638 6.66666 9.33333 7.26361 9.33333 7.99999C9.33333 8.73637 8.73638 9.33332 8 9.33332C7.26362 9.33332 6.66667 8.73637 6.66667 7.99999Z'
              fill='#2D3648'
            />
            <path
              d='M11.3333 7.99999C11.3333 7.26361 11.9303 6.66666 12.6667 6.66666C13.403 6.66666 14 7.26361 14 7.99999C14 8.73637 13.403 9.33332 12.6667 9.33332C11.9303 9.33332 11.3333 8.73637 11.3333 7.99999Z'
              fill='#2D3648'
            />
          </g>
        </g>
      </svg>
      <p>{expTitle}</p>
    </StyledfavItem>
  );
};
export default FavItem;
