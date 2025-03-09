import styled from "styled-components";

import { useEffect } from "react";

import { useAuth0 } from "@auth0/auth0-react";
import ReactModal from "react-modal";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { initializeDefaultValues } from "./reducers/defaultValuesReducer";
import { initializeSavedTrainings } from "./reducers/savedExperienceReducer";

// Router
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

// Components
import GlobalStyles from "./GlobalStyles.jsx";
import Login from "./components/LoginRegister/Login.jsx";
import Register from "./components/LoginRegister/Register.jsx";
import Header from "./components/shared/Header/Header.jsx";
import Aside from "./components/shared/Aside/Aside.jsx";
import TrainingContainer from "./components/Experience/TrainingContainer.jsx";
import RequestContainer from "./components/Experience/RequestContainer.jsx";

// Commons
import Notification from "./components/common/Notification";
import ConfirmationAlert from "./components/common/ConfirmationAlert";
import MainLoader from "./components/common/MainLoader.jsx";

// Hooks
import useToken from "./Hooks/useToken.jsx";

const AppContainer = styled.div`
  height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr;
  border: 4px solid var(--dark-500);
`;

const StyledMainContent = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
`;

const ProtectedLayout = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <MainLoader />;

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  return (
    <AppContainer>
      <Header
        userName={user.name}
        userEmail={user.email}
        userImage={user.picture}
      />
      <StyledMainContent>
        <Aside />

        <Outlet />
      </StyledMainContent>
    </AppContainer>
  );
};

const App = () => {
  const dispatch = useDispatch();
  const { token, loading: tokenLoading } = useToken();

  const trainingStatus = useSelector((state) => state.training.status);
  const trainingError = useSelector((state) => state.training.error);

  useEffect(() => {
    ReactModal.setAppElement("#root");
  }, []);

  // Inicializar defaultValues
  useEffect(() => {
    if (!tokenLoading && token) {
      dispatch(initializeDefaultValues(token));
    }
  }, [dispatch, token, tokenLoading]);

  // Inicializar savedExperiences
  useEffect(() => {
    if (!tokenLoading && token) {      
      dispatch(initializeSavedTrainings(token));
    }
  }, [dispatch, token, tokenLoading]);

  // Renderizado condicional según el estado de carga o error en training
  if (tokenLoading || trainingStatus === "loading") {
    return <MainLoader />;
  }

  if (trainingStatus === "failed") {
    throw new Error(`Error al inicializar training: ${trainingError}`);
  }

  return (
    <>
      <GlobalStyles />

      <Routes>
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route element={<ProtectedLayout />}>
          <Route path='/' element={<TrainingContainer />} />
          <Route path='/request' element={<RequestContainer />} />
        </Route>
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>

      <Notification />
      <ConfirmationAlert />
    </>
  );
};

export default App;
