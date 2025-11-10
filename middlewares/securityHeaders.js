const helmet = require("helmet");
const { config } = require("../utils/config");

const securityHeaders = helmet({
  // Use configuration from environment-specific config files
  contentSecurityPolicy: config.security.helmet.contentSecurityPolicy,
  crossOriginEmbedderPolicy: false, // Allow cross-origin requests for API
  hsts: config.security.helmet.hsts,
  noSniff: true, // Prevent MIME type sniffing
  frameguard: { action: "deny" }, // Prevent clickjacking
  xssFilter: true, // Enable XSS protection
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
});

module.exports = securityHeaders;
