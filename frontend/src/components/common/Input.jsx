import { styled } from "styled-components";

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
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
  gap: 1rem;

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
    text-align: left;
  }

  label:nth-child(2) {
    color: var(--dark-400);
    font-weight: 400;
    text-align: right;
  }
`;

const StyledInput = styled.input`
  height: 45px;
  padding: 0 1rem;
  border-radius: 12px;
  border: 2px solid
    ${(props) =>
      props["data-is-invalid"]
        ? "var(--red-error, #e63946)"
        : "var(--dark-800)"};
  background: #ffffff;
  transition: border-color 0.3s ease, background-color 0.3s ease;

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

  &::placeholder {
    color: var(--dark-400);
    font-size: 14px;
  }
`;

const ErrorText = styled.span`
  color: var(--red-error, #e63946);
  font-size: 12px;
  margin: 0.3rem 0;
`;

const Input = ({
  primaryLabel,
  secondaryLabel,
  type = "text",
  id,
  name,
  min,
  max,
  step,
  placeholder,
  value,
  setValue,
  error,
  isEditable = true,
}) => {
  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleBlur = (e) => {
    if (type !== "number") return;

    let raw = e.target.value;

    if (raw === "") {
      return;
    }

    raw = raw.replace(/^0+(?=\d)/, "");

    const num = Number(raw);

    if (isNaN(num)) {
      setValue("");
      return;
    }

    if (typeof min !== "undefined" && num < min) {
      setValue(String(min));
      return;
    }
    if (typeof max !== "undefined" && num > max) {
      setValue(String(max));
      return;
    }

    setValue(String(num));
  };

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
        onChange={isEditable ? handleChange : undefined}
        onBlur={isEditable ? handleBlur : undefined}
        readOnly={!isEditable}
        data-is-invalid={error}
        {...(type === "number" && { min, max, step })}
      />

      {error && <ErrorText>{error}</ErrorText>}
    </InputContainer>
  );
};

export default Input;
