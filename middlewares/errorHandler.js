const { isCelebrateError } = require("celebrate");
const { INTERNAL_SERVER_ERROR } = require("../utils/errors");

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Handle Celebrate validation errors
  if (isCelebrateError(err)) {
    const validationErrors = [];

    // Collect validation errors from body
    const bodyError = err.details.get("body");
    if (bodyError) {
      const bodyDetails = bodyError.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message.replace(/"/g, ""),
      }));
      validationErrors.push(...bodyDetails);
    }

    // Collect validation errors from params
    const paramsError = err.details.get("params");
    if (paramsError) {
      const paramsDetails = paramsError.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message.replace(/"/g, ""),
      }));
      validationErrors.push(...paramsDetails);
    }

    const message =
      validationErrors.length > 0
        ? validationErrors
            .map((error) => `${error.field}: ${error.message}`)
            .join(", ")
        : "Validation failed";

    return res.status(400).send({
      message: `Validation failed: ${message}`,
      errors: validationErrors,
    });
  }

  // Handle MongoDB CastError (invalid ObjectId)
  if (err.name === "CastError") {
    return res.status(400).send({ message: "Invalid ID format" });
  }

  // Handle MongoDB duplicate key error
  if (err.code === 11000) {
    return res.status(409).send({ message: "Resource already exists" });
  }

  // Handle MongoDB validation errors
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).send({ message: messages.join(", ") });
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).send({ message: "Invalid token" });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).send({ message: "Token expired" });
  }

  // Handle Mongoose connection errors
  if (err.name === "MongooseError" || err.name === "MongoError") {
    return res.status(500).send({ message: "Database connection error" });
  }

  // Handle custom application errors
  const { statusCode = 500, message } = err;
  return res.status(statusCode).send({
    message:
      statusCode === INTERNAL_SERVER_ERROR ? "Internal Server Error" : message,
  });
};

module.exports = errorHandler;
