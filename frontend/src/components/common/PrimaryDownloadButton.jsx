import styled from "styled-components";

import { useState, useRef, useEffect } from "react";

//Icons
import ChevronUpIcon from "../../assets/svg/icon-chevron-up.svg?react";

const Container = styled.div`
  display: inline-flex;
  position: relative;

  svg {
    width: 18px;
    heigth: 18px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: stretch;

  & > button:first-child {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-right: 2px solid var(--white);
  }
`;

const MainButton = styled.button`
  position: relative;
  display: flex;
  padding: 12px 20px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  background: var(--dark-800);
  color: var(--white);
  font-family: Inter, sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  border: 2px solid var(--dark-800);
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: var(--dark-500);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }

  &:active {
    background: var(--dark-900);
    transform: translateY(1px);
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
  }

  &:disabled {
    background: var(--dark-400);
    color: var(--dark-200);
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
`;

const FormatButton = styled(MainButton)`
  padding: 12px 15px;
  border-left: none;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;

  svg {
    transition: transform 0.3s ease;
    transform: ${(props) =>
      props["data-is-open"] ? "rotate(180deg)" : "rotate(0)"};
  }
`;

const DropdownContainer = styled.div`
  position: absolute;
  bottom: calc(100% + 4px);
  right: 0;
  min-width: 120px;
  background: white;
  border-radius: 8px;
  border: 2px solid var(--dark-800);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: ${(props) => (props["data-is-open"] ? "block" : "none")};
  overflow: hidden;
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
  font-family: Inter, sans-serif;

  &:hover {
    background-color: var(--dark-100);
  }

  &[data-selected="true"] {
    background-color: var(--dark-200);
    font-weight: 500;
  }
`;

const PrimaryDownloadButton = ({
  SVG,
  text = "Imprimir",
  onDownload,
  disabled = false,
  defaultFormat,
  formats = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState(defaultFormat);
  const containerRef = useRef(null);

  const handleDownload = () => {
    onDownload(selectedFormat);
  };

  const handleFormatSelect = (format) => {
    setSelectedFormat(format);
    setIsOpen(false);
  };

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

  return (
    <Container ref={containerRef}>
      <ButtonGroup>
        <MainButton
          onClick={handleDownload}
          disabled={disabled}
          aria-label='Descargar archivo'
        >
          <SVG />
          <span>{text}</span>
        </MainButton>

        <FormatButton
          type='button'
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
          data-is-open={isOpen}
          aria-expanded={isOpen}
          aria-haspopup='listbox'
        >
          <span>{selectedFormat.toUpperCase()}</span>
          <ChevronUpIcon />
        </FormatButton>
      </ButtonGroup>

      <DropdownContainer data-is-open={isOpen}>
        <OptionsList role='listbox'>
          {formats.map((format) => (
            <Option
              key={format.value}
              onClick={() => handleFormatSelect(format.value)}
              data-selected={selectedFormat === format.value}
              role='option'
              aria-selected={selectedFormat === format.value}
            >
              {format.label}
            </Option>
          ))}
        </OptionsList>
      </DropdownContainer>
    </Container>
  );
};

export default PrimaryDownloadButton;
