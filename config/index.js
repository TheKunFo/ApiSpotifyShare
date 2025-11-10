require("dotenv").config();

const constants = require("./constants");
const developmentConfig = require("./development");
const productionConfig = require("./production");

// Environment-based configuration loader
function loadConfig() {
  const env = process.env.NODE_ENV || "development";

  // Select environment-specific configuration
  const envConfig = env === "production" ? productionConfig : developmentConfig;

  // Validate required production environment variables
  if (env === "production") {
    const requiredVars = ["MONGODB_URI", "JWT_SECRET"];
    const missingVars = requiredVars.filter((varName) => !process.env[varName]);

    if (missingVars.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missingVars.join(", ")}`
      );
    }
  }

  return {
    // Environment info
    NODE_ENV: env,

    // Legacy exports for backward compatibility
    JWT_SECRET: envConfig.jwt.secret,
    MONGODB_URI: envConfig.database.uri,
    PORT: envConfig.server.port,
    DOMAIN: envConfig.server.domain,
    SSL_CERT_PATH: envConfig.ssl?.certPath,
    SSL_KEY_PATH: envConfig.ssl?.keyPath,

    // New structured configuration
    config: envConfig,
    constants,
  };
}

module.exports = loadConfig();
