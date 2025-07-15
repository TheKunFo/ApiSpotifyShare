const constants = require("./constants");

// Production Configuration
module.exports = {
  // Database Configuration
  database: {
    uri:
      process.env.MONGODB_URI ||
      `mongodb://${constants.DATABASE.DEFAULT_HOST}:${constants.DATABASE.DEFAULT_PORT}/${constants.DATABASE.NAME}`,
    options: {
      ...constants.DATABASE.CONNECTION_OPTIONS,
      ssl: true, // Enable SSL in production
      sslValidate: true,
    },
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: constants.SECURITY.JWT.EXPIRES_IN,
    algorithm: constants.SECURITY.JWT.ALGORITHM,
  },

  // Server Configuration
  server: {
    port: process.env.PORT || constants.SERVER.DEFAULT_PORT,
    domain: process.env.DOMAIN || constants.SERVER.PRODUCTION_DOMAIN,
    protocol: "https",
  },

  // SSL Configuration
  ssl: {
    certPath: process.env.SSL_CERT_PATH,
    keyPath: process.env.SSL_KEY_PATH,
  },

  // CORS Configuration
  cors: {
    origins: [
      `https://${process.env.DOMAIN || constants.SERVER.PRODUCTION_DOMAIN}`,
      `http://${process.env.DOMAIN || constants.SERVER.PRODUCTION_DOMAIN}`,
      `https://api.${process.env.DOMAIN || constants.SERVER.PRODUCTION_DOMAIN}`,
      `http://api.${process.env.DOMAIN || constants.SERVER.PRODUCTION_DOMAIN}`,
    ],
    credentials: true,
    maxAge: constants.SECURITY.CORS.MAX_AGE,
  },

  // Security Configuration
  security: {
    helmet: {
      hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true,
      },
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'"],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"],
        },
      },
    },
  },

  // Logging Configuration
  logging: {
    level: "info",
    console: false, // Disable console logging in production
    files: {
      error: "logs/error.log",
      combined: "logs/request.log",
    },
  },
};
