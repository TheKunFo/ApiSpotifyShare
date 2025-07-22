require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const { errors } = require("celebrate");

const {
  NODE_ENV,
  PORT = 3002,
  MONGODB_URI,
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

// Configure CORS based on environment
const corsOptions = {
  origin(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }

    // Create a fresh copy of allowed origins to avoid mutation
    const allowedOrigins = [...config.cors.origins];

    // Add dynamic origins based on current environment
    if (NODE_ENV === "production") {
      allowedOrigins.push(
        "https://spotify.thekunfo.com",
        "https://apispotify.thekunfo.com"
      );
    } else {
      // Development - allow localhost origins
      allowedOrigins.push(
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "http://localhost:3002",
        "http://127.0.0.1:3002",
        "http://apispotify.localhost:3002",
        "http://apispotify.localhost:5173"
      );
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, false); // Don't throw error, just deny
  },
  credentials: config.cors.credentials,
  maxAge: config.cors.maxAge,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Origin",
    "X-Requested-With",
    "Accept",
  ],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(securityHeaders);
app.use(rateLimiters.general); // Apply general rate limiting to all requests
app.use(requestLogger);
app.use(responseLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to handle api subdomain routing
app.use((req, res, next) => {
  const host = req.get("host") || "";
  const isApiSubdomain = host.startsWith("api.");

  // If request comes from api subdomain, treat root path as API
  if (isApiSubdomain && req.path === "/") {
    req.url = "/api";
  } else if (isApiSubdomain && !req.path.startsWith("/api")) {
    req.url = `/api${req.path}`;
  }

  next();
});

app.use(cors(corsOptions));

// Root endpoint to provide API information
app.get("/", (req, res) => {
  res.json({
    name: "Spotify Share API Server",
    message: "API is available at /api endpoint",
    apiEndpoint: "/api",
    documentation: "Visit /api for detailed endpoint information",
  });
});

app.use("/api", router);

app.use((_req, _res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

app.use(errors());

app.use(errorLogger);
app.use(errorHandler);
mongoose.connect(MONGODB_URI);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App running in port ${PORT}`);
});
