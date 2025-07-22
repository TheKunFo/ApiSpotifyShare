const express = require("express");
const { celebrate, Joi, Segments } = require("celebrate");
const auth = require("../middlewares/auth");
const playlistController = require("../controllers/PlaylistController");

const playlistRoutes = express.Router();

playlistRoutes.get("/", playlistController.getAllPlaylists);
playlistRoutes.get("/", playlistController.getAllPlaylists);

playlistRoutes.get(
  "/:id",
  "/:id",
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.string().hex().length(24).required(),
    }),
  }),
=======

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
>>>>>>> 130478b207ee574c762b03be90de95eb15e58d1a
  playlistController.getPlaylistById
);

// All routes in this file require authentication (handled by index.js)

playlistRoutes.post(
  "/",
  auth,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().min(1).required(),
      description: Joi.string().allow("").optional(),
      isPublic: Joi.boolean(),
      items: Joi.array()
        .items(
          Joi.object().keys({
            spotifyId: Joi.string().required(),
            name: Joi.string().required(),
            artist: Joi.string().required(),
            albumArt: Joi.string().uri().required(),
            type: Joi.string().valid("track", "album").required(),
          })
        )
        .optional(),
      description: Joi.string().allow("").optional(),
      isPublic: Joi.boolean(),
      items: Joi.array()
        .items(
          Joi.object().keys({
            spotifyId: Joi.string().required(),
            name: Joi.string().required(),
            artist: Joi.string().required(),
            albumArt: Joi.string().uri().required(),
            type: Joi.string().valid("track", "album").required(),
          })
        )
        .optional(),
    }),
  }),
=======
  rateLimiters.playlist,
  validateCreatePlaylist,
>>>>>>> 130478b207ee574c762b03be90de95eb15e58d1a
  playlistController.createPlaylist
);

playlistRoutes.patch(
  "/:id",
  auth,
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.string().hex().length(24).required(),
    }),
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().min(1).optional(),
      description: Joi.string().allow("").optional(),
      items: Joi.array()
        .items(
          Joi.object().keys({
            spotifyId: Joi.string().required(),
            name: Joi.string().required(),
            artist: Joi.string().required(),
            albumArt: Joi.string().uri().required(),
            type: Joi.string().valid("track", "album").required(),
          })
        )
        .optional(),
      description: Joi.string().allow("").optional(),
      items: Joi.array()
        .items(
          Joi.object().keys({
            spotifyId: Joi.string().required(),
            name: Joi.string().required(),
            artist: Joi.string().required(),
            albumArt: Joi.string().uri().required(),
            type: Joi.string().valid("track", "album").required(),
          })
        )
        .optional(),
    }),
  }),
=======
  rateLimiters.playlist,
  validateUpdatePlaylist,
>>>>>>> 130478b207ee574c762b03be90de95eb15e58d1a
  playlistController.updatePlaylist
);

playlistRoutes.delete(
  "/:id",
  auth,
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.string().hex().length(24).required(),
    }),
  }),
=======
  rateLimiters.playlist,
  validatePlaylistId,
>>>>>>> 130478b207ee574c762b03be90de95eb15e58d1a
  playlistController.deletePlaylist
);

playlistRoutes.post(
  "/:id/like",
  auth,
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.string().hex().length(24).required(),
    }),
  }),
=======
  validatePlaylistId,
>>>>>>> 130478b207ee574c762b03be90de95eb15e58d1a
  playlistController.likePlaylist
);

playlistRoutes.post(
  "/:id/unlike",
  auth,
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.string().hex().length(24).required(),
    }),
  }),
=======
  validatePlaylistId,
>>>>>>> 130478b207ee574c762b03be90de95eb15e58d1a
  playlistController.unlikePlaylist
);

module.exports = playlistRoutes;
