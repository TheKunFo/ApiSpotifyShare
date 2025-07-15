const express = require("express");

const playlistController = require("../controllers/PlaylistController");
const {
  validateCreatePlaylist,
  validateUpdatePlaylist,
  validatePlaylistId,
} = require("../middlewares/validation");
const rateLimiters = require("../middlewares/rateLimiter");

const playlistRoutes = express.Router();

// Public playlist routes - read operations
playlistRoutes.get(
  "/playlists",
  rateLimiters.read,
  playlistController.getAllPlaylists
);

playlistRoutes.get(
  "/playlists/:id",
  rateLimiters.read,
  validatePlaylistId,
  playlistController.getPlaylistById
);

// All routes in this file require authentication (handled by index.js)

playlistRoutes.post(
  "/",
  rateLimiters.playlist,
  validateCreatePlaylist,
  playlistController.createPlaylist
);

playlistRoutes.patch(
  "/:id",
  rateLimiters.playlist,
  validateUpdatePlaylist,
  playlistController.updatePlaylist
);

playlistRoutes.delete(
  "/:id",
  rateLimiters.playlist,
  validatePlaylistId,
  playlistController.deletePlaylist
);

playlistRoutes.post(
  "/:id/like",
  validatePlaylistId,
  playlistController.likePlaylist
);

playlistRoutes.post(
  "/:id/unlike",
  validatePlaylistId,
  playlistController.unlikePlaylist
);

module.exports = playlistRoutes;
