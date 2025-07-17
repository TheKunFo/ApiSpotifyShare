// Legacy configuration file - now imports from new config structure
// This file is kept for backward compatibility
const configLoader = require("../config/index");

module.exports = {
  JWT_SECRET: configLoader.JWT_SECRET,
  NODE_ENV: configLoader.NODE_ENV,
  MONGODB_URI: configLoader.MONGODB_URI,
  DOMAIN: configLoader.DOMAIN,
  PORT: configLoader.PORT,
  SSL_CERT_PATH: configLoader.SSL_CERT_PATH,
  SSL_KEY_PATH: configLoader.SSL_KEY_PATH,

  // Expose new configuration structure
  config: configLoader.config,
  constants: configLoader.constants,
};
