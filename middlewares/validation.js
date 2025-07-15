const { celebrate, Joi, Segments } = require("celebrate");

// User validation schemas
const validateSignin = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
});

const validateSignup = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    avatar: Joi.string().uri().optional(),
  }),
});

const validateUpdateProfile = celebrate({
  [Segments.BODY]: Joi.object()
    .keys({
      name: Joi.string().min(2).max(30).optional(),
      avatar: Joi.string().uri().optional(),
    })
    .or("name", "avatar"), // At least one of these fields must be provided
});

// Playlist validation schemas
const validatePlaylistId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
});

const validateCreatePlaylist = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(1).required(),
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
});

const validateUpdatePlaylist = celebrate({
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
  }),
});

module.exports = {
  // User validations
  validateSignin,
  validateSignup,
  validateUpdateProfile,

  // Playlist validations
  validatePlaylistId,
  validateCreatePlaylist,
  validateUpdatePlaylist,
};
