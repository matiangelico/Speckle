import styled from "styled-components"

import { useState, useRef, useEffect } from "react"

//Icons
import ChevronUpIcon from "../../assets/svg/icon-chevron-up.svg?react";

const Container = styled.div`
  display: inline-flex;
  position: relative;

  svg {
    width: 18px;
    height: 18px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: stretch;

  & > button:first-child {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-right: 2px solid var(--dark-800);
  }
`;

const BaseButton = styled.button`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: 2px solid var(--dark-800);
  background-color: var(--white);
  color: var(--dark-800);
  font-family: Inter, sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: var(--dark-100);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }

  &:active {
    background: var(--dark-200);
    transform: translateY(1px);
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
  }

  &:disabled {
    background-color: var(--dark-100);
    border-color: var(--dark-300);
    color: var(--dark-400);
    cursor: not-allowed;
  }
`;

const MainButton = styled(BaseButton)`
  border-right: none;
  border-radius: 8px 0 0 8px;
`;

const FormatButton = styled(BaseButton)`
  padding: 12px 15px;
  border-left: none;
  border-radius: 0 8px 8px 0;

  svg {
    transition: transform 0.3s ease;
    transform: ${(props) => (props["data-is-open"] ? "rotate(180deg)" : "rotate(0)")};
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

const StyledText = styled.span`
  color: inherit;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: -0.16px;
`;

const SecondaryDownloadButton = ({
  SVG,
  text = "Descargar",
  onDownload,
  disabled = false,
  defaultFormat = "txt",
  formats = [],
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFormat, setSelectedFormat] = useState(defaultFormat)
  const containerRef = useRef(null)

  const handleDownload = () => {
    onDownload(selectedFormat)
  }

  const handleFormatSelect = (format) => {
    setSelectedFormat(format)
    setIsOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <Container ref={containerRef}>
      <ButtonGroup>
        <MainButton onClick={handleDownload} disabled={disabled} aria-label="Descargar archivo">
          <SVG />
          <StyledText>{text}</StyledText>
        </MainButton>

        <FormatButton
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
          data-is-open={isOpen}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <StyledText>{selectedFormat.toUpperCase()}</StyledText>
          <ChevronUpIcon />
        </FormatButton>
      </ButtonGroup>

      <DropdownContainer data-is-open={isOpen}>
        <OptionsList role="listbox">
          {formats.map((format) => (
            <Option
              key={format.value}
              onClick={() => handleFormatSelect(format.value)}
              data-selected={selectedFormat === format.value}
              role="option"
              aria-selected={selectedFormat === format.value}
            >
              {format.label}
            </Option>
          ))}
        </OptionsList>
      </DropdownContainer>
    </Container>
  )
}

export default SecondaryDownloadButton
