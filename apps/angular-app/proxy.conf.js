const PROXY_CONFIG = [
  {
    context: [
      "/jbpm/api"
    ],
    target: "http://localhost:8080/kie-server/services/rest",
    secure: false,
    changeOrigin: true,
    pathRewrite: {
      "^/jbpm/api": ""
    },
    logLevel: "debug"
  }
];

module.exports = PROXY_CONFIG; 