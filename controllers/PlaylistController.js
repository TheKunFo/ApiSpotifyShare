const Playlist = require("../models/PlaylistModel");
const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");
const InternalServerError = require("../errors/InternalServerError");
const ForbiddenError = require("../errors/ForbiddenError");
const { CREATED } = require("../utils/errors");

const createPlaylist = async (req, res, next) => {
  const { name, description, items, isPublic } = req.body;
  const userId = req.user._id;

  if (!name) {
    return next(new BadRequestError("Name is required"));
  }

  try {
    const newPlaylist = await Playlist.create({
      name,
      description,
      items,
      userId,
<<<<<<< HEAD
      isPublic,
=======
>>>>>>> 130478b207ee574c762b03be90de95eb15e58d1a
    });

    return res.status(CREATED).send(newPlaylist);
  } catch (err) {
    if (err.name === "ValidationError") {
      return next(new BadRequestError("Invalid data"));
    }
    return next(new InternalServerError("Failed to create playlist"));
  }
};

const getAllPlaylists = (req, res, next) => {
  try {
<<<<<<< HEAD
    const playlists = Playlist.find().populate("userId", "name");
=======
    const playlists = await Playlist.find().populate("userId", "name");
>>>>>>> 130478b207ee574c762b03be90de95eb15e58d1a
    return res.json({ data: playlists });
  } catch (err) {
    return next(new InternalServerError("Failed to get playlists"));
  }
};

const getPlaylistById = (req, res, next) => {
  try {
<<<<<<< HEAD
    const playlist = Playlist.findById(req.params.id).populate(
=======
    const playlist = await Playlist.findById(req.params.id).populate(
>>>>>>> 130478b207ee574c762b03be90de95eb15e58d1a
      "userId",
      "name"
    );
    if (!playlist) {
      return next(new NotFoundError("Playlist not found"));
    }
    return res.json({ data: playlist });
  } catch (err) {
<<<<<<< HEAD
=======
    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid playlist ID"));
    }
>>>>>>> 130478b207ee574c762b03be90de95eb15e58d1a
    return next(new InternalServerError("Failed to get playlist"));
  }
};

const updatePlaylist = (req, res, next) => {
  const { name, description, items } = req.body;
  const userId = req.user._id;

  try {
    const playlist = Playlist.findById(req.params.id);
    if (!playlist) {
      return next(new NotFoundError("Playlist not found"));
    }

    if (playlist.userId.toString() !== userId.toString()) {
      return next(new ForbiddenError("Not authorized to update this playlist"));
    }

    playlist.name = name || playlist.name;
    playlist.description = description || playlist.description;
    playlist.items = items || playlist.items;

    playlist.save();
    return res.json({ data: playlist });
  } catch (err) {
    if (err.name === "ValidationError") {
      return next(new BadRequestError("Invalid data"));
    }
<<<<<<< HEAD
=======
    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid playlist ID"));
    }
>>>>>>> 130478b207ee574c762b03be90de95eb15e58d1a
    return next(new InternalServerError("Failed to update playlist"));
  }
};

const deletePlaylist = (req, res, next) => {
  const userId = req.user._id;

  try {
    const playlist = Playlist.findById(req.params.id);
    if (!playlist) {
      return next(new NotFoundError("Playlist not found"));
    }

    if (playlist.userId.toString() !== userId.toString()) {
      return next(new ForbiddenError("Not authorized to delete this playlist"));
    }

<<<<<<< HEAD
    playlist.deleteOne();
    return res.json({ message: "Playlist deleted" });
  } catch (err) {
=======
    await playlist.deleteOne();
    return res.json({ message: "Playlist deleted" });
  } catch (err) {
    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid playlist ID"));
    }
>>>>>>> 130478b207ee574c762b03be90de95eb15e58d1a
    return next(new InternalServerError("Failed to delete playlist"));
  }
};

const likePlaylist = (req, res, next) => {
  try {
    const playlist = Playlist.findById(req.params.id);
    if (!playlist) {
      return next(new NotFoundError("Playlist not found"));
    }

    if (!playlist.likes.includes(req.user._id)) {
      playlist.likes.push(req.user._id);
    }

    playlist.save();
    return res.json({ data: playlist });
  } catch (err) {
<<<<<<< HEAD
=======
    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid playlist ID"));
    }
>>>>>>> 130478b207ee574c762b03be90de95eb15e58d1a
    return next(new InternalServerError("Failed to like playlist"));
  }
};

const unlikePlaylist = (req, res, next) => {
  try {
    const playlist = Playlist.findById(req.params.id);
    if (!playlist) {
      return next(new NotFoundError("Playlist not found"));
    }

    playlist.likes = playlist.likes.filter(
      (userId) => userId.toString() !== req.user._id.toString()
    );

    playlist.save();
    return res.json({ data: playlist });
  } catch (err) {
<<<<<<< HEAD
=======
    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid playlist ID"));
    }
>>>>>>> 130478b207ee574c762b03be90de95eb15e58d1a
    return next(new InternalServerError("Failed to unlike playlist"));
  }
};

module.exports = {
  createPlaylist,
  getAllPlaylists,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
  likePlaylist,
  unlikePlaylist,
};
