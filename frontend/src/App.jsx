import styled from "styled-components";

import { useAuth0 } from "@auth0/auth0-react";

import GlobalStyles from "./GlobalStyles.jsx";
import Login from "./components/Login/Login.jsx";
import Header from "./components/shared/Header/Header.jsx";
import Aside from "./components/shared/Aside/Aside.jsx";
import ExperienceContainer from "./components/Experience/ExperienceContainer.jsx";

const AppContainer = styled.div`
  height: 100vh; /* Ocupará el 100% de la altura de la ventana */
  border-radius: 0.5rem;
  border: 4px solid var(--dark-500);

  display: grid;
  grid-template-rows: auto 1fr;
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  /* overflow: hidden; */

  display: grid;
  grid-template-columns: auto 1fr;
`;

const App = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <>
      <GlobalStyles /> {/*No funciona en React Native*/}
      {!isAuthenticated ? (
        <Login />
      ) : (
        <AppContainer>
          <Header />
          <MainContent>
            <Aside />
            <ExperienceContainer />
          </MainContent>
        </AppContainer>
      )}
    </>
  );
};

export default App;
