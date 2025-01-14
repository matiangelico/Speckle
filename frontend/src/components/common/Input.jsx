import { styled } from "styled-components";

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  // width: 100%;
  min-width: 200px; 
  max-width: 426px;
  text-align: left;
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
    letter-spacing: -0.14px;
  }
`;

const StyledInput = styled.input`
  height: 45px;
  padding: 0 1rem; /* Añadir padding interno para texto */
  border-radius: 12px;
  border: 2px solid
    ${(props) =>
      props["data-is-invalid"]
        ? "var(--red-error, #e63946)"
        : "var(--dark-800)"};
  background: #ffffff;
  transition: border-color 0.3s ease, background-color 0.3s ease;

  &:hover {
    background: #f3f3f3; /* Cambio de fondo en hover */
  }

  &:focus {
    border-color: ${(props) =>
      props["data-is-invalid"]
        ? "var(--red-error, #e63946)"
        : "var(--dark-800)"};
    background: #ffffff;
    outline: none; /* Elimina el borde azul predeterminado */
  }

  &::placeholder {
    color: var(--dark-400); /* Placeholder más claro */
    font-size: 14px;
  }
`;

const ErrorText = styled.span`
  color: var(--red-error, #e63946);
  font-size: 12px;
  margin-top: 0.3rem;
`;

const Input = ({
  primaryLabel,
  secondaryLabel,
  type,
  id,
  name,
  placeholder,
  value,
  setValue,
  error,
}) => {
  return (
    <InputContainer>
      <LabelContainer>
        <label htmlFor={id}>{primaryLabel}</label>
        {secondaryLabel && <label htmlFor={id}>{secondaryLabel}</label>}
      </LabelContainer>

      <StyledInput
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        data-is-invalid={error}
      />

      {error && <ErrorText>{error}</ErrorText>}
    </InputContainer>
  );
};

export default Input;
