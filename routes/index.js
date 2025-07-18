const express = require("express");

const router = express.Router();

const { login, createUser } = require("../controllers/UserController");
const playlistController = require("../controllers/PlaylistController");
const auth = require("../middlewares/auth");
const {
  validateSignin,
  validateSignup,
  validatePlaylistId,
} = require("../middlewares/validation");
const rateLimiters = require("../middlewares/rateLimiter");
const userRoutes = require("./UserRoutes");
const playlistRoutes = require("./PlaylistRoutes");

// API status endpoint
router.get("/", (req, res) => {
  res.json({
    message: "Spotify Share API",
    version: "1.0.0",
    status: "active",
    rateLimits: {
      general: "100 requests per 15 minutes",
      authentication: "5 attempts per 15 minutes",
      playlistOperations: "20 operations per 5 minutes",
      readOperations: "60 requests per minute",
    },
    endpoints: {
      public: [
        "POST /api/signin",
        "POST /api/signup",
        "GET /api/playlists",
        "GET /api/playlists/:id",
      ],
      protected: [
        "GET /users/me",
        "PATCH /users/me",
        "POST /playlists",
        "PATCH /playlists/:id",
        "DELETE /playlists/:id",
      ],
    },
  });
});

// Public routes (no authentication required)
router.post("/signin", rateLimiters.auth, validateSignin, login);

router.post("/signup", rateLimiters.auth, validateSignup, createUser);

// Protected routes (authentication required)
router.use(auth);
router.use("/users", userRoutes);
router.use("/playlists", playlistRoutes);

module.exports = router;
