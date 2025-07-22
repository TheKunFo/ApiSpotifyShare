require("dotenv").config();

const { PORT = 3002 } = process.env.PORT;
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const { errors } = require("celebrate");
const { DATABASE_URL } = require("./utils/config");

const {
  MONGODB_URI,
  NODE_ENV,
  PORT,
  DOMAIN,
  SSL_CERT_PATH,
  SSL_KEY_PATH,
  config,
} = require("./utils/config");
console.log(require("./utils/config"));
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
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

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
        "http://127.0.0.1:3002"
      );
    }

    console.log("CORS check:", {
      origin,
      NODE_ENV,
      allowed: allowedOrigins.includes(origin),
    });

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn("CORS blocked origin:", origin, "Allowed:", allowedOrigins);
      callback(null, false); // Don't throw error, just deny
    }
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

app.use(cors(corsOptions));

app.use("/", router);
app.use(auth);
app.use("/playlists", playlistRoutes);
app.use("/users", userRoutes);
app.use((_req, _res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

app.use(errors());

app.use(errorLogger);
app.use(errorHandler);
mongoose.connect("mongodb://127.0.0.1:27017/spotify_share_playlist");

app.listen(PORT, () => {
  console.log(`App running in port ${PORT}`);
});
