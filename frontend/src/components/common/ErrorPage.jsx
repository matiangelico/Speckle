import { styled } from "styled-components";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

//Assets
import HexagonBackground from "../../assets/webp/hexagon_background.webp";

const BackgroundContainer = styled.div`
  overflow: hidden;
  height: 100vh;
  // width: 100vw;
  background-image: url(${HexagonBackground});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  z-index: -1;
`;

const ErrorContainer = styled.div`
  display: inline-flex;
  height: 100%;
  padding: 0px 120px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;

  background: linear-gradient(270deg, rgba(255, 255, 255, 0.25) 0%, #fff 20%);
`;

const ErrorContentContainer = styled.div`
  width: 526px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 32px;
  text-align: center;
`;

const ErrorIcon = styled.div`
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #eef1f3;

  svg {
    width: 48px;
    height: 48px;
    color: #ff5252;
  }
`;

const TitleContainer = styled.div`
  flex-shrink: 0;

  h1 {
    color: var(--dark-800, #080a11);
    font-family: Inter;
    font-size: 42px;
    font-style: normal;
    font-weight: 700;
    line-height: 110%;
    letter-spacing: -2px;
  }

  p {
    color: var(--dark-800, #080a11);
    font-family: Inter;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    max-width: 80%;
    margin: 0 auto;
  }
`;

const ErrorPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirige a la ruta "/" después de 5 segundos
    const timer = setTimeout(() => {
      navigate("/", { replace: true });
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <BackgroundContainer>
      <ErrorContainer>
        <ErrorContentContainer>
          <ErrorIcon>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <circle cx='12' cy='12' r='10' />
              <line x1='12' y1='8' x2='12' y2='12' />
              <line x1='12' y1='16' x2='12.01' y2='16' />
            </svg>
          </ErrorIcon>

          <TitleContainer>
            <h1>¡Ups! Algo salió mal</h1>
            <p>
              Hemos detectado un problema inesperado en el sistema. Esto puede
              deberse a una interrupción temporal o a un error en la aplicación.
            </p>
            <br/>
            <p>
              Si el problema persiste, por favor contacta al equipo de soporte
              técnico.
            </p>
          </TitleContainer>
        </ErrorContentContainer>
      </ErrorContainer>
    </BackgroundContainer>
  );
};

export default ErrorPage;
