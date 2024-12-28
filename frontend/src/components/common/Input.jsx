import { styled } from "styled-components";

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%; /* Responsivo */
  max-width: 426px; /* Ancho máximo */
  text-align: left;
  margin-bottom: 1rem; /* Espaciado entre inputs */

  label {
    color: var(--dark-800);
    font-family: Inter, sans-serif;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 0.5rem; /* Espacio entre label y input */
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
  textLabel,
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
      <label htmlFor={id}>{textLabel}</label>
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
