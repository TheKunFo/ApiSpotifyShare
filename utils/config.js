// Legacy configuration file - now imports from new config structure
// This file is kept for backward compatibility
const configLoader = require("../config/index");

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || "dev-secret-key",
};
