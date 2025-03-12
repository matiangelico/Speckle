import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";

import ErrorBoundary from "./ErrorBoundary.jsx";
import App from "./App.jsx";
import store from "./reducers/store";

const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Auth0Provider
      domain={auth0Domain}
      clientId={auth0ClientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "speckle-descriptor-api",
        scope: "openid profile email",
        response_type: "code",
      }}
      cacheLocation='localstorage'
    >
      <Provider store={store}>
        <Router>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </Router>
      </Provider>
    </Auth0Provider>
  </StrictMode>
);
