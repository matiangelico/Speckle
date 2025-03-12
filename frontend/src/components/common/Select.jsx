import styled from "styled-components";
import { useState, useRef, useEffect } from "react";

//Icons
import SearchIcon from "../../assets/svg/icon-search.svg?react";
import ChevronDownIcon from "../../assets/svg/icon-chevron-down.svg?react";

const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 200px;
  max-width: 426px;
  text-align: left;
  position: relative;
`;

const LabelContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: flex-start;
  justify-content: space-between;
  align-self: stretch;
  margin-bottom: 0.5rem;
  padding: 0 0.1rem;

  label {
    font-family: Inter, sans-serif;
    font-size: 14px;
    font-feature-settings: "calt" off;
    line-height: 115%;
    letter-spacing: -0.14px;
  }

  label:nth-child(1) {
    color: var(--dark-800);
    font-weight: 500;
  }

  label:nth-child(2) {
    color: var(--dark-400);
    font-weight: 400;
  }
`;

const SelectButton = styled.button`
  height: 45px;
  padding: 0 0.75rem 0 1rem;
  border-radius: 12px;
  border: 2px solid
    ${(props) =>
      props["data-is-invalid"]
        ? "var(--red-error, #e63946)"
        : "var(--dark-800)"};
  background: #ffffff;
  transition: border-color 0.3s ease, background-color 0.3s ease;
  width: 100%;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  color: ${(props) =>
    props["data-has-value"] ? "var(--dark-800)" : "var(--dark-400)"};
  font-size: 14px;

  &:hover {
    background: #f3f3f3;
  }

  &:focus {
    border-color: ${(props) =>
      props["data-is-invalid"]
        ? "var(--red-error, #e63946)"
        : "var(--dark-800)"};
    background: #ffffff;
    outline: none;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  svg {
    width: 20px;
    heigt: 20px;
    color: var(--dark-800);
  }
`;

const DropdownContainer = styled.div`
  position: absolute;
  top: calc(100% - 45px);
  left: 0;
  right: 0;
  background: white;
  border-radius: 12px;
  border: 2px solid var(--dark-800);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 230px;
  display: ${(props) => (props["data-is-open"] ? "block" : "none")};
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 0px;
    box-sizing: content-box;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #c1c1c1;
    border-radius: 6px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #999;
  }
`;

const SearchContainer = styled.div`
  padding: 8px 12px;
  border-bottom: 2px solid var(--dark-800);
  position: sticky;
  top: 0;
  background: white;
  display: flex;
  align-items: center;
  gap: 8px;

  input {
    border: none;
    outline: none;
    width: 100%;
    padding: 4px;
    font-size: 14px;
    color: var(--dark-800);

    &::placeholder {
      color: var(--dark-400);
    }

    &:disabled {
      background: #f9f9f9;
      cursor: not-allowed;
    }
  }

  svg {
    width: 16px;
    heigt: 16px;
  }
`;

const OptionsList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const Option = styled.li`
  padding: 10px 16px;
  cursor: pointer;
  font-size: 14px;
  color: var(--dark-800);
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--dark-100);
  }

  &[data-selected="true"] {
    background-color: var(--dark-200);
    font-weight: 500;
  }
`;

const ErrorText = styled.span`
  color: var(--red-error, #e63946);
  font-size: 12px;
  margin-top: 0.3rem;
`;

const Select = ({
  primaryLabel,
  secondaryLabel,
  id,
  name,
  placeholder = "Seleccionar...",
  value,
  onChange,
  options = [],
  error,
  searchable = true,
  editable = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef(null);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option) => {
    if (!editable) return;
    onChange(option.value);
    setIsOpen(false);
    setSearchTerm("");
  };

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (!editable) return;
    if (e.key === "Enter" || e.key === " ") {
      setIsOpen(!isOpen);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <SelectContainer ref={containerRef}>
      <LabelContainer>
        <label htmlFor={id}>{primaryLabel}</label>
        {secondaryLabel && <label htmlFor={id}>{secondaryLabel}</label>}
      </LabelContainer>

      <SelectButton
        type='button'
        id={id}
        name={name}
        onClick={() => {
          if (editable) setIsOpen(!isOpen);
        }}
        onKeyDown={handleKeyDown}
        data-is-invalid={error}
        data-is-open={isOpen}
        data-has-value={!!selectedOption}
        aria-expanded={isOpen}
        aria-haspopup='listbox'
        disabled={!editable}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDownIcon />
      </SelectButton>

      <DropdownContainer data-is-open={isOpen}>
        {searchable && (
          <SearchContainer>
            <SearchIcon />
            <input
              type='text'
              placeholder='Buscar...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              disabled={!editable}
            />
          </SearchContainer>
        )}

        <OptionsList role='listbox'>
          {filteredOptions.map((option, index) => (
            <Option
              key={index}
              onClick={() => handleSelect(option)}
              data-selected={value === option.value}
              role='option'
              aria-selected={value === option.value}
            >
              {option.label}
            </Option>
          ))}
          {filteredOptions.length === 0 && (
            <Option style={{ cursor: "default", color: "var(--dark-400)" }}>
              No se encontraron resultados
            </Option>
          )}
        </OptionsList>
      </DropdownContainer>

      {error && <ErrorText>{error}</ErrorText>}
    </SelectContainer>
  );
};

export default Select;
