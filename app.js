require("dotenv").config();

const { PORT = 3001 } = process.env;
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const { errors } = require("celebrate");

const auth = require("./middlewares/auth");
const userRoutes = require("./routes/UserRoutes");
const router = require("./routes/index");
const errorHandler = require("./middlewares/errorHandler");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const NotFoundError = require("./errors/NotFoundError");

const app = express();

app.use(requestLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use("/", router);
app.use(auth);

app.use("/users", userRoutes);
app.use((_req, _res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

app.use(errors());

app.use(errorLogger);
app.use(errorHandler);
mongoose.connect("mongodb://127.0.0.1:27017/spotify_share_playlist");

app.listen(PORT, () => {
  console.log(`App running in port ${PORT}`);
});
