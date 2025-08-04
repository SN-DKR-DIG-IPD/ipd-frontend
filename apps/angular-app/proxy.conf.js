const PROXY_CONFIG = [
  {
    context: [
      "/jbpm/api"
    ],
    target: "http://jbpm.localhost:8082",
    secure: false,
    changeOrigin: true,
    pathRewrite: {
      "^/jbpm/api": "/kie-server/services/rest"
    },
    logLevel: "debug"
  }
];

module.exports = PROXY_CONFIG; 