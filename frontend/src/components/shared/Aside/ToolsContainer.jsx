import { styled } from "styled-components";

import SearchIcon from "../../../assets/svg/icon-search.svg?react";
// import FilterIcon from "../../../assets/svg/icon-filter.svg?react";

const StyledToolsContainer = styled.div`
  display: flex;
  padding: 0.75rem 1rem;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  align-self: stretch;

  .search-bar {
    flex: 1 0 0;
    color: var(--dark-300);
    font-size: 0.6875rem;
    font-style: normal;
    font-weight: 500;
    line-height: 140%; /* 0.9625rem */
    letter-spacing: 0.06875rem;
    background: var(--dark-100);
    border: 0;
  }

  .search-bar svg {
    width: 1rem;
    height: 1rem;
  }
`;

const ToolsContainer = () => {
  return (
    <StyledToolsContainer>
      <SearchIcon />
      <input id='searchInput' type='text' placeholder='Buscar...' className='search-bar' />
      {/* <FilterIcon /> */}
    </StyledToolsContainer>
  );
};

export default ToolsContainer;
