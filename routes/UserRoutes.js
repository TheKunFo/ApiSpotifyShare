const express = require("express");
const { celebrate, Joi, Segments } = require("celebrate");
const auth = require("../middlewares/auth");

const userRoutes = express.Router();

const {
  getCurrentUser,
  updateUserProfile,
} = require("../controllers/UserController");

userRoutes.get("/me", auth, getCurrentUser);

userRoutes.patch(
  "/me",
  auth,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      avatar: Joi.string().uri().optional(),
    }),
  }),
  updateUserProfile
);

module.exports = userRoutes;
