require('dotenv').config();

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-key',
  DATABASE_URL: process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/spotify_share_playlist',
};