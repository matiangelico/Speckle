import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  :root {
    --light: #EAE7E2;
    --red-error: #FF5252;
    --red-error-light: #FFB8B8;
    --green-success: #2EDB4B;
    --green-success-light: #D1FFD9;
    --dark-100: #EEF1F3;
    --dark-200: #DFE3E8;
    --dark-300: #B0B4BB;
    --dark-400: #6F7278;
    --dark-500: #1B1C1E;
    --dark-600: #2A2B2F;
    --dark-700: #3B3D42;
    --dark-800: #080A11;
    --dark-900: #05060E;
    --white: #FFFFFF;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box; /*De esta manera incluyo el padding y el border en la altura-ancho total*/
  }

  html {
    font-family: 'Inter', sans-serif;
    min-width: 375px;
    overflow: hidden;
  }

  body {
    display: grid;
    place-items: center;
    min-height: 100vh;
    margin: 0;
  }

  #root {
    width: 100%;
    max-height: 100%;
  }

  input:focus {
    outline: none;
  }

  /* MODAL */
  .Modal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--white);
    
    max-width: 530px;
    max-height: 90vh;
    z-index: 101;

    display: flex;
    flex-direction: column;
    align-items: flex-start;

    border-radius: 16px;
    border: 2.5px solid var(--dark-800);
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  }

  /* OVERLAY */
  .Overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 100;
  }
`;

export default GlobalStyles;
