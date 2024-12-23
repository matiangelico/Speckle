import { useAuth0 } from "@auth0/auth0-react";

import GlobalStyles from "./GlobalStyles.jsx";
import Header from "./components/shared/Header.jsx";
import Aside from "./components/shared/Aside/Aside.jsx";
import ExperienceContainer from "./components/Experience/ExperienceContainer.jsx";
import Login from "./components/Login/Login.jsx";

import "../styles/App.css";

const App = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <>
      <GlobalStyles /> {/*No funciona en React Native*/}
      {!isAuthenticated ? (
        <Login />
      ) : (
        <div className='app-container'>
          <Header />
          <div className='main-content'>
            <Aside />
            <ExperienceContainer />
          </div>
        </div>
      )}
    </>
  );
};

export default App;
