const express = require("express");
const authRoutes = express.Router();

const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../models/User");

authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    res.status(400).json({ message: "Provide username and password" });
    return;
  }

  if (password.length < 3) {
    res.status(400).json({
      message: "Any password must have at least 3 characters",
    });
    return;
  }

  User.findOne({ username }, (err, foundUser) => {
    if (err) {
      res.status(500).json({ message: "Username check went bad." });
      return;
    }

    if (foundUser) {
      res.status(400).json({ message: "Username taken. Choose another one." });
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username: username,
      password: hashPass,
    });

    newUser.save((err) => {
      if (err) {
        res
          .status(400)
          .json({ message: "Saving user to database went wrong." });
        return;
      }
      req.login(newUser, (err) => {
        if (err) {
          res.status(500).json({ message: "Login after signup went bad." });
          return;
        }

        res.status(200).json(newUser);
      });
    });
  });
});

const loginHandler = require("../middleware/passport");
authRoutes.post("/login", loginHandler);

authRoutes.get("/logout", (req, res, next) => {
  if (typeof req.user === "undefined")
    res.status(400).send("you were not loggedin!");
  req.logout();
  res.status(200).json({ message: "Log out success!" });
});

authRoutes.get("/is-auth", (req, res, next) => {
  if (typeof req.user === "undefined")
    res.status(403).json({ message: "Unauthorized" });
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
    return;
  }
});

authRoutes.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  })
);
authRoutes.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/private-page",
    failureRedirect: "/",
  })
);

module.exports = authRoutes;
