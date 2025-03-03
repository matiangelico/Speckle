import styled from "styled-components";

import { useEffect } from "react";

import { useAuth0 } from "@auth0/auth0-react";
import ReactModal from "react-modal";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { initializeDefaultValues } from "./reducers/defaultValuesReducer.jsx";
// import { initializeTrainingAsync } from "./reducers/trainingReducer.jsx"; // Importa el thunk

// Router
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

// Components
import GlobalStyles from "./GlobalStyles.jsx";
import Login from "./components/Login/Login.jsx";
import TrainingMainContent from "./components/Experience/TrainingMainContent.jsx";
import RequestMainContainer from "./components/Experience/RequestMainContainer.jsx";
import Header from "./components/shared/Header/Header.jsx";

// Commons
import Notification from "./components/common/Notification";
import ConfirmationAlert from "./components/common/ConfirmationAlert";

// Hooks
import useToken from "./components/Hooks/useToken.jsx";

const AppContainer = styled.div`
  height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr;
  border: 4px solid var(--dark-500);
`;

const ProtectedLayout = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <div>Cargando...</div>;

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  return (
    <AppContainer>
      <Header userName={user.name} userEmail={user.email} />
      <Outlet />
    </AppContainer>
  );
};

const App = () => {
  const dispatch = useDispatch();
  const { token, loading: tokenLoading } = useToken();

  const trainingStatus = useSelector((state) => state.training.status);
  const trainingError = useSelector((state) => state.training.error);

  // Inicializar defaultValues
  useEffect(() => {
    if (!tokenLoading && token) {
      dispatch(initializeDefaultValues(token));
    }
  }, [dispatch, token, tokenLoading]);

  // Renderizado condicional según el estado de carga o error en training
  if (tokenLoading || trainingStatus === "loading") {
    return <div>Cargando...</div>;
  }

  if (trainingStatus === "failed") {
    return <div>Error al inicializar training: {trainingError}</div>;
  }

  return (
    <>
      <GlobalStyles />

      <Routes>
        <Route path='/login' element={<Login />} />
        <Route element={<ProtectedLayout />}>
          <Route path='/' element={<TrainingMainContent />} />
          <Route path='/request' element={<RequestMainContainer />} />
        </Route>
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>

      <Notification />
      <ConfirmationAlert />
    </>
  );
};

ReactModal.setAppElement("#root");

export default App;
