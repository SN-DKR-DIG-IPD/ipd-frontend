// IIFE used in prod mode, config should be provided by environment variables
(function (window) {
  window.__env = window.__env || {};

  // SIS API url
  window.__env = {
    keycloak: {
      // Url of the Identity Provider
      issuer: "${JBPM_KEYCLOAK_ISSUER}",

      // Realm
      realm: "${JBPM_KEYCLOAK_REALM}",

      // client
      clientId: "${JBPM_KEYCLOAK_CLIENT_ID}",
    },

    apiUrl: "${JBPM_API_URL}",
    bpmAPIBaseUrl : "${JBPM_KIE_SERVER_API_BASE_URL}",
    businessCentralAPIBaseUrl: "${JBPM_BUSINESS_CENTRAL_API_BASE_URL}"
  };

  // Whether or not to enable debug mode
  // Setting this to false will disable console output
  window.__env.enableDebug = false;
})(this);
