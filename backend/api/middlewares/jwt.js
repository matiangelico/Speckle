const { auth } = require('express-oauth2-jwt-bearer');
require("dotenv").config();


const authMiddleware = auth({
  audience: process.env.AUTH0_API_IDENTIFIER, 
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`, 
  tokenSigningAlg: 'RS256',
});

module.exports = { authMiddleware };
