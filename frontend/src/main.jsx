import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {Auth0Provider} from '@auth0/auth0-react'

const apiUrl = import.meta.env.VITE_API_URL;
const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN;

console.log( apiUrl,auth0ClientId,auth0Domain);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Auth0Provider domain={auth0Domain} clientId={auth0ClientId} redirectUri={window.location.origin}>
      <App />
    </Auth0Provider>
  </StrictMode>,
)
