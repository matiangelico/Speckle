import { useAuth0 } from "@auth0/auth0-react";

import GlobalStyles from './GlobalStyles.jsx';
import Header from "./Header.jsx";
import Aside from "./Aside";
import ExperienceContainer from "./ExperienceContainer.jsx";

import "../styles/App.css";

const App = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  return (
    <div>
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
    </div>
  );
};

export default App;
