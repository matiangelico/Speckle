import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  :root {
    --light: #EAE7E2;
    --red-error: #E63946;
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
  }

  body {
    display: grid;
    place-items: center;
    //width: 94.5rem;
    min-height: 100vh;
    margin: 0;
  }

  #root {
    width: 100%;
    //max-width: 1512px;
    max-height: 100%;
  }

  input:focus {
    outline: none;
  }
`;

export default GlobalStyles;
