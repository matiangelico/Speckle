import { useAuth0 } from "@auth0/auth0-react";

import GlobalStyles from './GlobalStyles.jsx';
import Header from './components/shared/Header.jsx';
import Aside from "./components/shared/Aside/Aside.jsx";
import ExperienceContainer from "./components/Experience/ExperienceContainer.jsx";

import "../styles/App.css";

const App = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  return (
    <>
      {!isAuthenticated ? (
        <button onClick={() => loginWithRedirect()}>Login</button>
      ) : (
        <div className='app-container'>
          <GlobalStyles /> {/*No funciona en React Native*/}
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
