import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";

import App from "./App.jsx";
import store from "./reducers/store";

const apiUrl = import.meta.env.VITE_API_URL;
const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN;

console.log(apiUrl);
console.log(auth0ClientId);
console.log(auth0Domain);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Auth0Provider
      domain={auth0Domain}
      clientId={auth0ClientId}
      authorizationParams={{ redirect_uri: window.location.origin }}
      cacheLocation='localstorage' // Importante para que no se pierda la sesión
    >
      <Provider store={store}>
        <Router>
          <App />
        </Router>
      </Provider>
    </Auth0Provider>
  </StrictMode>
);
