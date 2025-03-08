import { styled } from "styled-components";
import axios from "axios";

import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

// Router
import { Link, useNavigate } from "react-router-dom";

//Commons
import Input from "../common/Input";
import SecondaryButton from "../common/SecondaryButton";

//Icons
import GoogleIcon from "../../assets/svg/icon-google.svg?react";

const LoginFormContainer = styled.div`
  width: 526px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;

  > :last-child {
    width: 80%;
    align-self: center;
  }

  form {
    width: 75%;

    input {
      margin-bottom: 1rem;
    }

    #remember {
      margin-bottom: 0;
    }
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
      color: #007bff; /* Color azul en hover */
      text-decoration-color: var(
        --primary,
        #007bff
      ); /* Cambiar el color del subrayado */
    }

    &:active {
      color: var(--dark-900, #000000); /* Color más oscuro en clic */
      text-decoration-color: var(--dark-900, #000000);
    }

    &:visited {
      color: var(
        --dark-600,
        #555555
      ); /* Color diferente para enlaces visitados */
    }
  }

  svg {
    width: 20px;
    height: 20px;
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
  flex-shrink: 0;
`;

const Separator = styled.div`
  margin: 0.5rem 0;
  position: relative;
  text-align: center;
  color: var(--dark-800, #080a11);

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    width: 45%;
    height: 2px;
    background: var(--dark-400, #080a11);
  }

  &::before {
    left: 0;
  }

  &::after {
    right: 0;
  }
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
    margin-bottom: 0;
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
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailError = !email.trim();
    const passwordError = !password.trim();
    setErrors({ email: emailError, password: passwordError });

    if (!emailError && !passwordError) {
      try {
        const response = await axios.post(
          `https://${import.meta.env.VITE_AUTH0_DOMAIN}/oauth/token`,
          {
            client_id: import.meta.env.VITE_AUTH0_CLIENT_ID,
            username: email,
            password: password,
            audience: "speckle-descriptor-api",
            grant_type: "password",
            scope: "openid profile email",
          }
        );

        localStorage.setItem("access_token", response.data.access_token);
        navigate("/");
      } catch (error) {
        let errorMessage = "Error desconocido";
        if (error.response) {
          errorMessage = error.response.data.error_description || "Credenciales incorrectas";
        } else if (error.request) {
          errorMessage = "No hay conexión al servidor";
        } else {
          errorMessage = error.message;
        }
        alert(errorMessage);
      }
    }
  };

  const handleGoogleLogin = () => {
    loginWithRedirect({
      authorizationParams: {
        connection: "google-oauth2" // Conexión social de Google
      }
    });
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
          primaryLabel={"Correo electrónico"}
          type={"email"}
          id={"email"}
          name={"email"}
          value={email}
          setValue={setEmail}
          error={errors.email && "Este campo es obligatorio"}
        />

        <Input
          primaryLabel={"Contraseña"}
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
          <a href='#'>¿Olvidaste tu contraseña?</a>
        </OptionsContainer>

        <SecondaryButton text={"Iniciar sesión"} type={"submit"} />

        <SingUp>
          ¿No tienes una cuenta?{" "}
          <Link to='/register'>Crea una cuenta gratis</Link>
        </SingUp>
      </form>

      <Separator>o</Separator>

      <SecondaryButton
        handleClick={handleGoogleLogin}
        SVG={GoogleIcon}
        text={"Continuar con Google"}
      />
    </LoginFormContainer>
  );
};

export default LoginForm;
