<<<<<<< HEAD
const express = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
=======
const express = require("express");
>>>>>>> 130478b207ee574c762b03be90de95eb15e58d1a

const userRoutes = express.Router();

const {
  getCurrentUser,
  updateUserProfile,
<<<<<<< HEAD
} = require('../controllers/UserController');

userRoutes.get('/me', getCurrentUser);

userRoutes.patch(
  '/me',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      avatar: Joi.string().uri().optional(),
    }),
  }),
=======
} = require("../controllers/UserController");
const { validateUpdateProfile } = require("../middlewares/validation");
const rateLimiters = require("../middlewares/rateLimiter");

// All routes in this file require authentication (handled by index.js)

userRoutes.get("/me", rateLimiters.read, getCurrentUser);

userRoutes.patch(
  "/me",
  rateLimiters.playlist,
  validateUpdateProfile,
>>>>>>> 130478b207ee574c762b03be90de95eb15e58d1a
  updateUserProfile
);

module.exports = userRoutes;
