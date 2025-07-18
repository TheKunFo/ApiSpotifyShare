const constants = require("./constants");

// Development Configuration
module.exports = {
  // Database Configuration
  database: {
    uri: `mongodb://${constants.DATABASE.DEFAULT_HOST}:${constants.DATABASE.DEFAULT_PORT}/${constants.DATABASE.NAME}`,
    options: constants.DATABASE.CONNECTION_OPTIONS,
  },

  // JWT Configuration
  jwt: {
    secret: "dev-jwt-secret-key-change-in-production",
    expiresIn: constants.SECURITY.JWT.EXPIRES_IN,
    algorithm: constants.SECURITY.JWT.ALGORITHM,
  },

  // Server Configuration
  server: {
    port: 3002, // Changed from default 3001 to avoid conflicts
    domain: constants.SERVER.DEFAULT_DOMAIN,
    protocol: "http",
  },

  // CORS Configuration
  cors: {
    origins: [
      "http://localhost:3000",
      "http://localhost:3002", // Updated backend port
      "http://127.0.0.1:3000",
      "http://127.0.0.1:3002", // Updated backend port
      "http://localhost:5173", // Vite dev server
      "http://127.0.0.1:5173", // Vite dev server
      // Add production origins for testing
      "https://spotify.thekunfo.com",
      "https://apispotify.thekunfo.com",
    ],
    credentials: true,
    maxAge: constants.SECURITY.CORS.MAX_AGE,
  },

  // Security Configuration
  security: {
    helmet: {
      hsts: false, // Disabled in development
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'", "'unsafe-eval'"], // Allow eval in development
          imgSrc: ["'self'", "data:", "http:", "https:"],
          connectSrc: ["'self'", "ws:", "wss:"], // WebSocket support for dev tools
        },
      },
    },
  },

  // Logging Configuration
  logging: {
    level: "debug",
    console: true,
    files: {
      error: "logs/error.log",
      combined: "logs/request.log",
    },
  },
};
