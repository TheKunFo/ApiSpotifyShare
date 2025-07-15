const rateLimit = require('express-rate-limit');
const { constants, config } = require('../utils/config');

// Rate limiter configurations for different endpoints
const rateLimiters = {
  // General API rate limiter
  general: rateLimit({
    windowMs: constants.API.RATE_LIMIT.WINDOW_MS, // 15 minutes
    max: constants.API.RATE_LIMIT.MAX_REQUESTS, // 100 requests per window
    message: {
      error: 'Too many requests',
      message: 'Too many requests from this IP, please try again later.',
      retryAfter: Math.ceil(constants.API.RATE_LIMIT.WINDOW_MS / 1000 / 60), // minutes
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req, res) => {
      res.status(429).json({
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: Math.ceil(constants.API.RATE_LIMIT.WINDOW_MS / 1000 / 60),
      });
    },
  }),

  // Stricter rate limiter for authentication endpoints
  auth: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Only 5 login/signup attempts per window
    message: {
      error: 'Too many authentication attempts',
      message: 'Too many authentication attempts from this IP, please try again later.',
      retryAfter: 15,
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // Don't count successful requests
    handler: (req, res) => {
      res.status(429).json({
        error: 'Authentication rate limit exceeded',
        message: 'Too many authentication attempts. Please try again in 15 minutes.',
        retryAfter: 15,
      });
    },
  }),

  // Moderate rate limiter for playlist creation/modification
  playlist: rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 20, // 20 playlist operations per window
    message: {
      error: 'Too many playlist operations',
      message: 'Too many playlist operations from this IP, please try again later.',
      retryAfter: 5,
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        error: 'Playlist operation rate limit exceeded',
        message: 'Too many playlist operations. Please try again in 5 minutes.',
        retryAfter: 5,
      });
    },
  }),

  // Lenient rate limiter for read operations
  read: rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 60, // 60 read requests per minute
    message: {
      error: 'Too many requests',
      message: 'Too many read requests from this IP, please try again later.',
      retryAfter: 1,
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        error: 'Read operation rate limit exceeded',
        message: 'Too many read requests. Please try again in 1 minute.',
        retryAfter: 1,
      });
    },
  }),
};

// Development override - more lenient in development
if (config.NODE_ENV === 'development') {
  Object.keys(rateLimiters).forEach((key) => {
    rateLimiters[key] = rateLimit({
      ...rateLimiters[key],
      max: rateLimiters[key].max * 10, // 10x more lenient in development
      message: {
        ...rateLimiters[key].message,
        message: `${rateLimiters[key].message.message} (Development mode)`,
      },
    });
  });
}

module.exports = rateLimiters;
