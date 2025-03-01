import { styled } from "styled-components";

import { useState, useRef } from "react";

// Icons
import SearchIcon from "../../../assets/svg/icon-search.svg?react";
import FilterIcon from "../../../assets/svg/icon-filter.svg?react";
import PrimaryButton from "../../common/PrimaryButton";
import SecondaryButton from "../../common/SecondaryButton";

const StyledToolsContainer = styled.div`
  display: flex;
  padding: 0.75rem 0.5rem;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  align-self: stretch;
  position: relative;
  // box-shadow: 0px 10px 10px rgb(255 255 255 / 100%);
  box-shadow: 0px 10px 10px rgba(238, 241, 243, 1);
`;

const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  background: var(--dark-100);
  border-radius: 4px;
  padding: 0.375rem 0.5rem;
  transition: background 0.2s ease;

  &:hover {
    background: var(--dark-200);
  }
`;

const SearchBar = styled.input`
  flex: 1;
  color: var(--dark-800);
  font-size: 0.8rem;
  font-weight: 500;
  line-height: 140%;
  letter-spacing: 0.06875rem;
  background: transparent;
  border: none;
  outline: none;
  padding-left: 0.5rem;
  transition: background 0.2s ease, color 0.2s ease;

  &:focus {
    color: var(--dark-800);
  }

  &::placeholder {
    color: var(--dark-400);
  }
`;

const IconButton = styled.button`
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;

  svg {
    width: 1rem;
    height: 1rem;
    fill: var(--dark-300);
    transition: fill 0.2s ease;
  }

  &:hover svg {
    fill: var(--dark-600);
  }
`;

const DateFilterContainer = styled.div`
  display: ${({ $isVisible }) => ($isVisible ? "flex" : "none")};
  flex-direction: column;
  padding: 0.75rem;
  background: var(--white);
  border: 2px solid var(--dark-800);
  border-radius: 8px;
  position: absolute;
  top: 100%;
  right: -8;
  z-index: 10;
  width: 250px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const FilterRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const FilterLabel = styled.label`
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--dark-600);
  margin-right: 0.5rem;
`;

const FilterInput = styled.input`
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--dark-800);
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--dark-400);
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;

  & > button:nth-child(1) {
    border: 2px solid var(--dark-800, #4741d7);
  }

  button {
    padding: 0.5rem;
    border: none;
    border-radius: 4px;

    span {
      font-size: 0.85rem;
      font-weight: 700;
    }
  }
`;

const ToolsContainer = ({ onSearch, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [dateFilters, setDateFilters] = useState({
    startDate: "",
    endDate: "",
  });
  const searchInputRef = useRef(null);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleSearchIconClick = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleFilterIconClick = () => {
    setShowDateFilter(!showDateFilter);
  };

  const handleDateFilterChange = (field, value) => {
    const newFilters = {
      ...dateFilters,
      [field]: value,
    };
    setDateFilters(newFilters);
  };

  const applyDateFilters = () => {
    onFilterChange(dateFilters);
    setShowDateFilter(false);
  };

  const clearDateFilters = () => {
    const clearedFilters = {
      startDate: "",
      endDate: "",
    };
    setDateFilters(clearedFilters);
    onFilterChange(clearedFilters);
    setShowDateFilter(false);
  };

  return (
    <StyledToolsContainer>
      <SearchBarContainer>
        <IconButton onClick={handleSearchIconClick} aria-label='Buscar'>
          <SearchIcon />
        </IconButton>
        <SearchBar
          ref={searchInputRef}
          id='searchInput'
          type='text'
          placeholder='Buscar...'
          className='search-bar'
          aria-label='Buscar'
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <IconButton
          onClick={handleFilterIconClick}
          aria-label='Filtrar por fecha'
        >
          <FilterIcon />
        </IconButton>
      </SearchBarContainer>

      <DateFilterContainer $isVisible={showDateFilter}>
        <FilterRow>
          <FilterLabel htmlFor='startDate'>Desde:</FilterLabel>
          <FilterInput
            id='startDate'
            type='date'
            value={dateFilters.startDate}
            onChange={(e) =>
              handleDateFilterChange("startDate", e.target.value)
            }
          />
        </FilterRow>
        <FilterRow>
          <FilterLabel htmlFor='endDate'>Hasta:</FilterLabel>
          <FilterInput
            id='endDate'
            type='date'
            value={dateFilters.endDate}
            onChange={(e) => handleDateFilterChange("endDate", e.target.value)}
          />
        </FilterRow>
        <ButtonsContainer>
          <SecondaryButton
            handleClick={clearDateFilters}
            // RightSVG={ArrowRightIcon}
            text={"Limpiar"}
          />
          <PrimaryButton
            handleClick={applyDateFilters}
            // RightSVG={ArrowRightIcon}
            text={"Aplicar"}
          />
        </ButtonsContainer>
      </DateFilterContainer>
    </StyledToolsContainer>
  );
};

export default ToolsContainer;
