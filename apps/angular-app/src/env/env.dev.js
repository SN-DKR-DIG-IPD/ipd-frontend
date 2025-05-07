// IIFE used for local dev
(function (window) {
  window.__env = window.__env || {};

  // SIS API url
  window.__env = {
    keycloak: {
      // Url of the Identity Provider
      issuer: 'http://localhost:8082/',

      // Realm
      realm: 'etalon',

      // client
      clientId: 'etalon-client',
    },

    apiUrl: 'http://localhost:8081',
    bpmAPIBaseUrl : 'http://localhost:8080/kie-server/services/rest/',
    businessCentralAPIBaseUrl: 'http://localhost:8080/business-central/rest/',
    // bpmAPIBaseUrl : 'https://backend-jbpm.atosapps.com/kie-server/services/rest/',
    // businessCentralAPIBaseUrl: 'https://backend-jbpm.atosapps.com/business-central/rest/'

  };

  // Whether or not to enable debug mode
  // Setting this to false will disable console output
  window.__env.enableDebug = true;
})(this);
