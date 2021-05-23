const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const session = require("express-session");
const bodyParser = require("body-parser");

// setup to deal with DeprecationWarning:
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

mongoose
  .connect(process.env.MONGODB_URI)
  .then((resolvedProm) => {
    console.log(
      `Connected to Mongo! Database name: "${resolvedProm.connections[0].name}"`
    );
  })
  .catch((err) => {
    console.error("Error connecting to mongo", err);
  });

const app = express();

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// mount express-session middleware.
app.use(
  session({
    secret: "o-nome-do-app-sera-banana-split",
    resave: true,
    saveUninitialized: true,
  })
);
// SETUP DO PASSPORT
require("./configs/passport");
const passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());
// fim cfg passport

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"],
  })
);

// root router mouting
const indexRouter = require("./routes/index");
app.use("/api", indexRouter);

module.exports = app;
