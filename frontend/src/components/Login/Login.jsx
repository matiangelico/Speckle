import { styled } from "styled-components";

import HexagonBackground from "../../assets/webp/hexagon_background.webp";

import LoginForm from "./LoginForm";

const BackgroundContainer = styled.div`
  margin: 0;
  padding: 0;
  overflow: hidden;
  height: 100vh;
  width: 100vw;
  background-image: url(${HexagonBackground});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  z-index: -1;
`;

const LoginContainer = styled.div`
  display: inline-flex;
  height: 100%;
  padding: 0px 120px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;

  background: linear-gradient(
    270deg,
    rgba(255, 255, 255, 0.25) 0%,
    #fff 20%
  );
`;

const Login = () => {

  return (
    <BackgroundContainer>
      <LoginContainer>
        <LoginForm />
      </LoginContainer>
    </BackgroundContainer>
  );
};

export default Login;
