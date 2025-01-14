import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";

import styled from "styled-components";

import { initializeDefaultValues } from "./reducers/defaultValuesReducer.jsx";

import GlobalStyles from "./GlobalStyles.jsx";
import Login from "./components/Login/Login.jsx";
import Header from "./components/shared/Header/Header.jsx";
import Aside from "./components/shared/Aside/Aside.jsx";
import ExperienceContainer from "./components/Experience/ExperienceContainer.jsx";

const AppContainer = styled.div`
  height: 100vh;
  border-radius: 0.5rem;
  border: 4px solid var(--dark-500);

  display: grid;
  grid-template-rows: auto 1fr;
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  //overflow: hidden;

  display: grid;
  grid-template-columns: auto 1fr;
`;

const App = () => {
  const { user, isAuthenticated } = useAuth0();
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(initializeDefaultValues());
  }, [dispatch]);

  return (
    <>
      <GlobalStyles /> {/*No funciona en React Native*/}
      {!isAuthenticated ? (
        <Login />
      ) : (
        <AppContainer>
          <Header
            userName={user.name}
            userEmail={user.email}
            pictureURL={user.picture}
          />
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
