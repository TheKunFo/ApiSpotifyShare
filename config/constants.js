// Application Constants
module.exports = {
  // Database Configuration
  DATABASE: {
    NAME: "spotify_share_playlist",
    DEFAULT_HOST: "127.0.0.1",
    DEFAULT_PORT: 27017,
    CONNECTION_OPTIONS: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },

  // Server Configuration
  SERVER: {
    DEFAULT_PORT: 3002,
    DEFAULT_DOMAIN: "localhost",
    PRODUCTION_DOMAIN: "spotify.thekunfo.com",
  },

  // Security Configuration
  SECURITY: {
    JWT: {
      EXPIRES_IN: "7d",
      ALGORITHM: "HS256",
    },
    BCRYPT: {
      SALT_ROUNDS: 12,
    },
    CORS: {
      MAX_AGE: 86400, // 24 hours
    },
  },

  // API Configuration
  API: {
    PREFIX: "/api",
    VERSION: "v1",
    RATE_LIMIT: {
      WINDOW_MS: 15 * 60 * 1000, // 15 minutes
      MAX_REQUESTS: 100, // per window
    },
  },

  // Logging Configuration
  LOGGING: {
    MAX_FILE_SIZE: 5242880, // 5MB
    MAX_FILES: 5,
    DATE_PATTERN: "YYYY-MM-DD",
  },

  // Validation Constants
  VALIDATION: {
    PASSWORD_MIN_LENGTH: 8,
    USERNAME_MIN_LENGTH: 2,
    USERNAME_MAX_LENGTH: 30,
    PLAYLIST_NAME_MAX_LENGTH: 100,
  },
};
