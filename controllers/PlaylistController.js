const Playlist = require("../models/PlaylistModel");
const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");
const InternalServerError = require("../errors/InternalServerError");
const ForbiddenError = require("../errors/ForbiddenError");
const { CREATED } = require("../utils/errors");

const createPlaylist = async (req, res, next) => {
  const { name, description, items } = req.body;
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
    });

    return res.status(CREATED).json({ data: newPlaylist });
  } catch (err) {
    if (err.name === "ValidationError") {
      return next(new BadRequestError("Invalid data"));
    }
    return next(new InternalServerError("Failed to create playlist"));
  }
};

const getAllPlaylists = async (req, res, next) => {
  try {
    const playlists = await Playlist.find().populate("userId", "name");
    return res.json({ data: playlists });
  } catch (err) {
    return next(new InternalServerError("Failed to get playlists"));
  }
};

const getPlaylistById = async (req, res, next) => {
  try {
    const playlist = await Playlist.findById(req.params.id).populate(
      "userId",
      "name"
    );
    if (!playlist) {
      return next(new NotFoundError("Playlist not found"));
    }
    return res.json({ data: playlist });
  } catch (err) {
    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid playlist ID"));
    }
    return next(new InternalServerError("Failed to get playlist"));
  }
};

const updatePlaylist = async (req, res, next) => {
  const { name, description, items } = req.body;
  const userId = req.user._id;

  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      return next(new NotFoundError("Playlist not found"));
    }

    if (playlist.userId.toString() !== userId.toString()) {
      return next(new ForbiddenError("Not authorized to update this playlist"));
    }

    playlist.name = name || playlist.name;
    playlist.description = description || playlist.description;
    playlist.items = items || playlist.items;

    await playlist.save();
    return res.json({ data: playlist });
  } catch (err) {
    if (err.name === "ValidationError") {
      return next(new BadRequestError("Invalid data"));
    }
    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid playlist ID"));
    }
    return next(new InternalServerError("Failed to update playlist"));
  }
};

const deletePlaylist = async (req, res, next) => {
  const userId = req.user._id;

  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      return next(new NotFoundError("Playlist not found"));
    }

    if (playlist.userId.toString() !== userId.toString()) {
      return next(new ForbiddenError("Not authorized to delete this playlist"));
    }

    await playlist.deleteOne();
    return res.json({ message: "Playlist deleted" });
  } catch (err) {
    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid playlist ID"));
    }
    return next(new InternalServerError("Failed to delete playlist"));
  }
};

const likePlaylist = async (req, res, next) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      return next(new NotFoundError("Playlist not found"));
    }

    if (!playlist.likes.includes(req.user._id)) {
      playlist.likes.push(req.user._id);
    }

    await playlist.save();
    return res.json({ data: playlist });
  } catch (err) {
    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid playlist ID"));
    }
    return next(new InternalServerError("Failed to like playlist"));
  }
};

const unlikePlaylist = async (req, res, next) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      return next(new NotFoundError("Playlist not found"));
    }

    playlist.likes = playlist.likes.filter(
      (userId) => userId.toString() !== req.user._id.toString()
    );

    await playlist.save();
    return res.json({ data: playlist });
  } catch (err) {
    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid playlist ID"));
    }
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
