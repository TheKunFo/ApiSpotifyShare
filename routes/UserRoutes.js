const express = require("express");

const userRoutes = express.Router();

const {
  getCurrentUser,
  updateUserProfile,
} = require("../controllers/UserController");
const { validateUpdateProfile } = require("../middlewares/validation");
const rateLimiters = require("../middlewares/rateLimiter");

// All routes in this file require authentication (handled by index.js)

userRoutes.get("/me", rateLimiters.read, getCurrentUser);

userRoutes.patch(
  "/me",
  rateLimiters.playlist,
  validateUpdateProfile,
  updateUserProfile
);

module.exports = userRoutes;
