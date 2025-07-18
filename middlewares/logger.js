const winston = require("winston");
const expressWinston = require("express-winston");

// All requests and responses are logged to logs/request.log

// Request Logger - logs incoming requests
const requestLogger = expressWinston.logger({
  transports: [new winston.transports.File({ filename: "logs/request.log" })],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  meta: true, // Include request and response metadata
  msg: "HTTP {{req.method}} {{req.url}} - {{res.statusCode}} {{res.responseTime}}ms",
  expressFormat: true, // Use default Express.js format
  colorize: false, // Disable colors for file logging
  requestWhitelist: [
    "url",
    "headers",
    "method",
    "httpVersion",
    "originalUrl",
    "query",
    "body",
  ],
  responseWhitelist: ["statusCode", "responseTime", "body"],
  bodyBlacklist: ["password"], // Hide sensitive data
  headerBlacklist: ["authorization"], // Hide authorization headers
  dynamicMeta: (req) => ({
    userAgent: req.get("User-Agent"),
    ip: req.ip || req.connection.remoteAddress,
    userId: req.user ? req.user._id : null,
  }),
});

// Error Logger
const errorLogger = expressWinston.errorLogger({
  transports: [new winston.transports.File({ filename: "logs/error.log" })],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  requestWhitelist: [
    "url",
    "headers",
    "method",
    "httpVersion",
    "originalUrl",
    "query",
  ],
  responseWhitelist: ["statusCode"],
  dynamicMeta: (req) => ({
    userAgent: req.get("User-Agent"),
    ip: req.ip || req.connection.remoteAddress,
    userId: req.user ? req.user._id : null,
  }),
});

// Custom response logger middleware - logs outgoing responses to request.log
const responseLogger = (req, res, next) => {
  const originalSend = res.send;
  const originalJson = res.json;

  // Winston logger for response logging to request.log
  const responseWinston = winston.createLogger({
    transports: [new winston.transports.File({ filename: "logs/request.log" })],
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
  });

  // Override res.send to log responses
  res.send = function sendResponse(data) {
    responseWinston.info("Response sent", {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseData:
        typeof data === "string"
          ? data.substring(0, 500)
          : JSON.stringify(data).substring(0, 500),
      timestamp: new Date().toISOString(),
      userAgent: req.get("User-Agent"),
      ip: req.ip || req.connection.remoteAddress,
      userId: req.user ? req.user._id : null,
      type: "response",
    });
    originalSend.call(this, data);
  };

  // Override res.json to log JSON responses
  res.json = function jsonResponse(data) {
    responseWinston.info("JSON Response sent", {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseData: JSON.stringify(data).substring(0, 500),
      timestamp: new Date().toISOString(),
      userAgent: req.get("User-Agent"),
      ip: req.ip || req.connection.remoteAddress,
      userId: req.user ? req.user._id : null,
      type: "response",
    });
    originalJson.call(this, data);
  };

  next();
};

module.exports = {
  requestLogger,
  errorLogger,
  responseLogger,
};
