require("dotenv").config();

const { PORT = 3002 } = process.env.PORT;
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const { errors } = require("celebrate");
const { DATABASE_URL } = require("./utils/config");

const auth = require("./middlewares/auth");
const userRoutes = require("./routes/UserRoutes");
const playlistRoutes = require("./routes/PlaylistRoutes");
const router = require("./routes/index");
const errorHandler = require("./middlewares/errorHandler");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const NotFoundError = require("./errors/NotFoundError");

const app = express();

app.use(requestLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use("/api", router);
app.use("/api", auth);
app.use("/api/playlists", playlistRoutes);
app.use("/api/users", userRoutes);
app.use((_req, _res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

app.use(errors());

app.use(errorLogger);
app.use(errorHandler);

mongoose.connect(DATABASE_URL);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App running in port ${PORT}`);
});
