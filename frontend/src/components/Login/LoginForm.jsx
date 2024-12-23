// import "../../../styles/LoginForm.css";
import { styled } from "styled-components";

import { useAuth0 } from "@auth0/auth0-react";
import Input from "../common/Input";
import SecondaryButton from "../common/SecondaryButton";
import { useState } from "react";

const LoginFormContainer = styled.div`
  width: 526px;
  height: 610px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;

  form {
    width: 75%;
  }

  a {
  color: var(--dark-800, #080a11);
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-style: italic;
  font-weight: 500;
  line-height: 1.5;
  text-decoration: underline;
  text-decoration-style: solid;
  text-decoration-skip-ink: auto; /* Ajuste automático para subrayar correctamente */
  text-underline-offset: 2px; /* Separación del texto */
  cursor: pointer;
  transition: color 0.3s ease, text-decoration-color 0.3s ease;

  &:hover {
    color: var(--primary, #007bff); /* Color azul en hover */
    text-decoration-color: var(--primary, #007bff); /* Cambiar el color del subrayado */
  }

  &:active {
    color: var(--dark-900, #000000); /* Color más oscuro en clic */
    text-decoration-color: var(--dark-900, #000000);
  }

  &:visited {
    color: var(--dark-600, #555555); /* Color diferente para enlaces visitados */
  }
}
`;

const TitleContainer = styled.div`
  flex-shrink: 0;
  margin-bottom: 32px;

  h1 {
    color: var(--dark-800, #080a11);
    font-family: Inter;
    font-size: 42px;
    font-style: normal;
    font-weight: 700;
    line-height: 110%;
    letter-spacing: -2px;
    margin-bottom: 12px;
    padding-right: 20px;
  }

  p {
    color: var(--dark-800, #080a11);
    font-family: Inter;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    padding-right: 20px;
  }
`;

const OptionsContainer = styled.div`
  width: 100%;
  margin-bottom: 24px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-shrink: 0;]
`;

const CheckboxContainer = styled.div`
  width: 108px;
  height: 22px;
  flex-shrink: 0;
  display: flex;
  align-items: center;

  label {
    color: var(--dark-800, #080a11);
    font-family: Inter;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 150%;
    margin-left: 0.5rem;
  }

  input {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }
`;

const SingUp = styled.p`
  color: var(--dark-800, #080a11);
  font-family: Inter;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%;
  margin-top: 18px;
`;

const LoginForm = () => {
  const { loginWithRedirect } = useAuth0();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: false, password: false });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación
    const emailError = email.trim() === "";
    const passwordError = password.trim() === "";

    setErrors({ email: emailError, password: passwordError });

    if (!emailError && !passwordError) {
      // Simulación de inicio de sesión exitoso
      loginWithRedirect();
    }
  };

  return (
    <LoginFormContainer>
      <TitleContainer>
        <h1>
          Bienvenido al sistema de análisis predictivo de patrones Speckle
        </h1>
        <p>
          Explora el impacto de tus ajustes en tiempo real mediante modelos
          predictivos avanzados.
        </p>
      </TitleContainer>
      <form onSubmit={handleSubmit}>
        <Input
          textLabel={"Correo electrónico"}
          type={"email"}
          id={"email"}
          name={"email"}
          value={email}
          setValue={setEmail}
          error={errors.email && "Este campo es obligatorio"}
        />

        <Input
          textLabel={"Contraseña"}
          type={"password"}
          id={"password"}
          name={"password"}
          value={password}
          setValue={setPassword}
          error={errors.password && "Este campo es obligatorio"}
        />

        <OptionsContainer>
          <CheckboxContainer>
            <input type='checkbox' id='remember' className='custom-checkbox' />
            <label htmlFor='remember'>Recuérdame</label>
          </CheckboxContainer>
          <a href='#' style={{ color: "var(--primary)" }}>
            ¿Olvidaste tu contraseña?
          </a>
        </OptionsContainer>

        <SecondaryButton text={"Iniciar sesión"} handleClick={handleSubmit} />

        <SingUp>
          ¿No tienes una cuenta?{" "}
          <a href='#' style={{ color: "var(--primary)" }}>
            Crea una cuenta gratis
          </a>
        </SingUp>
      </form>
    </LoginFormContainer>
  );
};

export default LoginForm;
