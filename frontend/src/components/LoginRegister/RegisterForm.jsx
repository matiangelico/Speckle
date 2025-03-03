import { styled } from "styled-components";
import axios from "axios";
import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

//Router
import { Link } from "react-router-dom";

//Commons
import Input from "../common/Input";
import SecondaryButton from "../common/SecondaryButton";

//Icons
import GoogleIcon from "../../assets/svg/icon-google.svg?react";

const RegisterFormContainer = styled.div`
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

     & > div {
      margin-bottom: 1rem;
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
    text-decoration-skip-ink: auto;
    text-underline-offset: 2px;
    cursor: pointer;
    transition: color 0.3s ease, text-decoration-color 0.3s ease;

    &:hover {
      color: #007bff;
      text-decoration-color: var(--primary, #007bff);
    }

    &:active {
      color: var(--dark-900, #000000);
      text-decoration-color: var(--dark-900, #000000);
    }

    &:visited {
      color: var(--dark-600, #555555);
    }
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const TitleContainer = styled.div`
  flex-shrink: 0;
  margin-bottom: 24px;

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

const PasswordRequirements = styled.div`
  margin-top: -0.5rem;
  margin-bottom: 1rem;

  p {
    color: var(--dark-600, #555555);
    font-family: Inter;
    font-size: 12px;
    font-style: italic;
    line-height: 140%;
  }
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

const LoginLink = styled.p`
  color: var(--dark-800, #080a11);
  font-family: Inter;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%;
  margin-top: 18px;
`;

const RegisterForm = () => {
  const { loginWithRedirect } = useAuth0();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  });

  // Validación de contraseña
  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
      minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones básicas
    const emailError = !email.trim() || !/\S+@\S+\.\S+/.test(email);
    const passwordError = !password.trim() || !validatePassword(password);
    const confirmPasswordError = password !== confirmPassword;

    setErrors({
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
    });

    if (!emailError && !passwordError && !confirmPasswordError) {
      try {
        // Aquí iría la lógica para registrar al usuario con Auth0
        // Este es un ejemplo y debe adaptarse a tu implementación específica
        const response = await axios.post(
          `https://${import.meta.env.VITE_AUTH0_DOMAIN}/dbconnections/signup`,
          {
            client_id: import.meta.env.VITE_AUTH0_CLIENT_ID,
            email: email,
            password: password,
            connection: "Username-Password-Authentication",
          }
        );

        console.log(response);

        // Si el registro es exitoso, redirigir al login o iniciar sesión automáticamente
        alert("Registro exitoso. Por favor inicia sesión.");
        window.location.href = "/login";
      } catch (error) {
        console.error("Error:", error.response?.data || error.message);
        alert("Error al registrar usuario. Por favor intenta nuevamente.");
      }
    }
  };

  const handleGoogleRegister = () => {
    loginWithRedirect({
      authorizationParams: {
        connection: "google-oauth2",
        screen_hint: "signup",
      },
    });
  };

  return (
    <RegisterFormContainer>
      <TitleContainer>
        <h1>Crea tu cuenta en el sistema Speckle</h1>
        <p>
          Únete a nuestra plataforma de análisis predictivo y comienza a
          explorar patrones avanzados en tiempo real.
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
          error={errors.email && "Ingresa un correo electrónico válido"}
        />

        <Input
          primaryLabel={"Contraseña"}
          type={"password"}
          id={"password"}
          name={"password"}
          value={password}
          setValue={setPassword}
          error={
            errors.password &&
            "La contraseña no cumple con los requisitos de seguridad"
          }
        />

        <PasswordRequirements>
          <p>
            La contraseña debe tener al menos 8 caracteres, incluir mayúsculas,
            minúsculas, números y caracteres especiales.
          </p>
        </PasswordRequirements>

        <Input
          primaryLabel={"Confirmar contraseña"}
          type={"password"}
          id={"confirmPassword"}
          name={"confirmPassword"}
          value={confirmPassword}
          setValue={setConfirmPassword}
          error={errors.confirmPassword && "Las contraseñas no coinciden"}
        />

        <SecondaryButton text={"Crear cuenta"} type={"submit"} />

        <LoginLink>
          ¿Ya tienes una cuenta? <Link to='/login'>Inicia sesión</Link>
        </LoginLink>
      </form>

      <Separator>o</Separator>

      <SecondaryButton
        handleClick={handleGoogleRegister}
        SVG={GoogleIcon}
        text={"Registrarse con Google"}
      />
    </RegisterFormContainer>
  );
};

export default RegisterForm;
