require("dotenv").config();

const fs = require("fs");
const https = require("https");
const http = require("http");
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const { errors } = require("celebrate");

const {
  MONGODB_URI,
  NODE_ENV,
  PORT,
  DOMAIN,
  SSL_CERT_PATH,
  SSL_KEY_PATH,
  config,
} = require("./utils/config");
const router = require("./routes/index");
const errorHandler = require("./middlewares/errorHandler");
const {
  requestLogger,
  errorLogger,
  responseLogger,
} = require("./middlewares/logger");
const securityHeaders = require("./middlewares/securityHeaders");
const rateLimiters = require("./middlewares/rateLimiter");
const NotFoundError = require("./errors/NotFoundError");

const app = express();

app.use(securityHeaders);
app.use(rateLimiters.general); // Apply general rate limiting to all requests
app.use(requestLogger);
app.use(responseLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration using environment-specific settings
const corsOptions = {
  origin: config.cors.origins,
  credentials: config.cors.credentials,
  optionsSuccessStatus: 200,
  maxAge: config.cors.maxAge,
};

app.use(cors(corsOptions));

// API routes - all routes are handled through routes/index.js under /api
app.use("/api", router);

app.use((_req, _res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

app.use(errors());

app.use(errorLogger);
app.use(errorHandler);

// Connect to MongoDB
mongoose.connect(MONGODB_URI);

// HTTPS configuration for production with SSL certificates
if (NODE_ENV === "production" && SSL_CERT_PATH && SSL_KEY_PATH) {
  try {
    const privateKey = fs.readFileSync(SSL_KEY_PATH, "utf8");
    const certificate = fs.readFileSync(SSL_CERT_PATH, "utf8");
    const credentials = { key: privateKey, cert: certificate };

    const httpsServer = https.createServer(credentials, app);
    httpsServer.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`HTTPS Server running on https://${DOMAIN}:${PORT}`);
      // eslint-disable-next-line no-console
      console.log(`API available at: https://${DOMAIN}:${PORT}/api`);
      // eslint-disable-next-line no-console
      console.log(`Alternative API URL: https://api.${DOMAIN}:${PORT}/`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(
      "SSL certificate error, falling back to HTTP:",
      error.message
    );
    // Fallback to HTTP
    const httpServer = http.createServer(app);
    httpServer.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`HTTP Server running on http://${DOMAIN}:${PORT}`);
      // eslint-disable-next-line no-console
      console.log(`API available at: http://${DOMAIN}:${PORT}/api`);
    });
  }
} else {
  // Development or production without SSL certificates
  const server = http.createServer(app);
  server.listen(PORT, () => {
    const protocol = NODE_ENV === "production" ? "https" : "http";
    const host = NODE_ENV === "production" ? DOMAIN : "localhost";
    // eslint-disable-next-line no-console
    console.log(
      `${protocol.toUpperCase()} Server running on ${protocol}://${host}:${PORT}`
    );
    // eslint-disable-next-line no-console
    console.log(`API available at: ${protocol}://${host}:${PORT}/api`);
  });
}
