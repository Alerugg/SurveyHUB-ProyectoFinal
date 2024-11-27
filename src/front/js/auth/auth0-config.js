export const auth0Config = {
  domain: "dev-qn1i850gfvm5fcb4.eu.auth0.com",
  clientId: "bRwmolpIAK0bcStqT8FgarzflpIAevHk",
  authorizationParams: {
      redirect_uri: window.location.origin + "/user_logued",
      scope: "openid profile email"
  },
  useRefreshTokens: true,
  cacheLocation: "localstorage"
};