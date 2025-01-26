import styled from "styled-components";

import { useEffect } from "react";

import { useAuth0 } from "@auth0/auth0-react";
import ReactModal from 'react-modal';

// Redux
import { useDispatch } from "react-redux";
import { initializeDefaultValues } from "./reducers/defaultValuesReducer.jsx";

// Components
import GlobalStyles from "./GlobalStyles.jsx";
import Login from "./components/Login/Login.jsx";
import Header from "./components/shared/Header/Header.jsx";
import Aside from "./components/shared/Aside/Aside.jsx";
import ExperienceContainer from "./components/Experience/ExperienceContainer.jsx";

const AppContainer = styled.div`
  height: 100vh;
  // border-radius: 0.5rem;
  border: 4px solid var(--dark-500);

  display: grid;
  grid-template-rows: auto 1fr;
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
`;

const App = () => {
  const { user, isAuthenticated } = useAuth0();
  // const { user, isAuthenticated, getAccessTokenSilently  } = useAuth0();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeDefaultValues());
  }, [dispatch]);

  // const getToken = async () => {
  //   try {
  //     const token = await getAccessTokenSilently();
  //     console.log(token);  // Aquí tendrás el JWT
  //   } catch (error) {
  //     console.error("Error obteniendo el token", error);
  //   }
  // };

  // getToken()

  ReactModal.setAppElement("#root");


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
