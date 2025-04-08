export const environmentDevelopment = {
  production: false,
  envName: 'local',
  keycloak: {
    issuer: 'http://localhost:8180',
    realm: 'IPD',
    clientId: 'ipd-client',
  },
  baseUrl: "http://localhost:8085/api/"
};
