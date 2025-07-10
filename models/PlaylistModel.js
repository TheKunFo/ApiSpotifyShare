const mongoose = require('mongoose');
const { Schema } = mongoose;

const PlaylistSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  items: [{
    spotifyId: String,
    name: String,
    artist: String,
    albumArt: String,
    type: String
  }],
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Playlist', PlaylistSchema);
