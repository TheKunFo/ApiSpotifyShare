const express = require("express");
const auth = require("../middlewares/auth");
const playlistController = require("../controllers/PlaylistController");
const {
  validateCreatePlaylist,
  validateUpdatePlaylist,
  validatePlaylistId,
} = require("../middlewares/validation");
const rateLimiters = require("../middlewares/rateLimiter");

const playlistRoutes = express.Router();

// Public playlist routes - read operations
playlistRoutes.get("/", rateLimiters.read, playlistController.getAllPlaylists);

playlistRoutes.get(
  "/:id",
  rateLimiters.read,
  validatePlaylistId,
  playlistController.getPlaylistById
);

// All routes below require authentication
playlistRoutes.post(
  "/",
  auth,
  rateLimiters.playlist,
  validateCreatePlaylist,
  playlistController.createPlaylist
);

playlistRoutes.patch(
  "/:id",
  auth,
  rateLimiters.playlist,
  validateUpdatePlaylist,
  playlistController.updatePlaylist
);

playlistRoutes.delete(
  "/:id",
  auth,
  rateLimiters.playlist,
  validatePlaylistId,
  playlistController.deletePlaylist
);

playlistRoutes.post(
  "/:id/like",
  auth,
  validatePlaylistId,
  playlistController.likePlaylist
);

playlistRoutes.post(
  "/:id/unlike",
  auth,
  validatePlaylistId,
  playlistController.unlikePlaylist
);

module.exports = playlistRoutes;
