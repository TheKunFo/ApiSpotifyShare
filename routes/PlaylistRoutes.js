const express = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const auth = require('../middlewares/auth');
const playlistController = require('../controllers/PlaylistController');

const playlistRoutes = express.Router();

playlistRoutes.get('/', playlistController.getAllPlaylists);

playlistRoutes.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.string().hex().length(24).required(),
    }),
  }),
  playlistController.getPlaylistById
);

playlistRoutes.post(
  '/',
  auth,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().min(1).required(),
      description: Joi.string().allow('').optional(),
      items: Joi.array().items(
        Joi.object().keys({
          spotifyId: Joi.string().required(),
          name: Joi.string().required(),
          artist: Joi.string().required(),
          albumArt: Joi.string().uri().required(),
          type: Joi.string().valid('track', 'album').required(),
        })
      ).optional(),
    }),
  }),
  playlistController.createPlaylist
);

playlistRoutes.patch(
  '/:id',
  auth,
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.string().hex().length(24).required(),
    }),
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().min(1).optional(),
      description: Joi.string().allow('').optional(),
      items: Joi.array().items(
        Joi.object().keys({
          spotifyId: Joi.string().required(),
          name: Joi.string().required(),
          artist: Joi.string().required(),
          albumArt: Joi.string().uri().required(),
          type: Joi.string().valid('track', 'album').required(),
        })
      ).optional(),
    }),
  }),
  playlistController.updatePlaylist
);

playlistRoutes.delete(
  '/:id',
  auth,
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.string().hex().length(24).required(),
    }),
  }),
  playlistController.deletePlaylist
);

playlistRoutes.post(
  '/:id/like',
  auth,
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.string().hex().length(24).required(),
    }),
  }),
  playlistController.likePlaylist
);

playlistRoutes.post(
  '/:id/unlike',
  auth,
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.string().hex().length(24).required(),
    }),
  }),
  playlistController.unlikePlaylist
);

module.exports = playlistRoutes;
