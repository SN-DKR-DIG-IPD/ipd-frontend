// IIFE used for local dev
(function (window) {
  window.__env = window.__env || {};

  // SIS API url
  window.__env = {
    keycloak: {
      // Url via proxy Angular
      issuer: '/realms',
      realm: 'etalon',
      clientId: 'etalon-client',
    },

    apiUrl: '/api',
    bpmAPIBaseUrl: '/jbpm/api/',
    businessCentralAPIBaseUrl: '/jbpm/business-central/rest/'
  };

  // Whether or not to enable debug mode
  // Setting this to false will disable console output
  window.__env.enableDebug = true;
})(this);
