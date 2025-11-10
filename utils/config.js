// Legacy configuration file - now imports from new config structure
// This file is kept for backward compatibility
const config = require("../config/index");

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || "dev-secret-key",
  ...config,
};
