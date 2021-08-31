const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { verify } = require("../middlewear");
const bcrypt = require("bcrypt");
const rounds = 10;

const jwt = require("jsonwebtoken");
const tokenSecret = process.env.TOKEN_SECRET;

router.get("/jwt-test", verify, (req, res) => {
  res.status(200).json({ msg: "It works", user: req.user });
});

router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        res.status(404).json({ msg: "no user with that email found" });
      } else {
        bcrypt.compare(password, user.password, (error, match) => {
          if (error) res.status(500).json(error);
          else if (match)
            res.status(200).json({ token: generateToken(user._id) });
          else res.status(403).json({ msg: "wrong email or password" });
        });
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.post("/signup", async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const password_confirm = req.body.password_confirm;

  const userExists = await User.exists({ email: email });

  if (userExists) {
    res.status(400).json({ msg: "User already exists" });
  } else if (password.length < 6) {
    res.status(400).json({ msg: "Password must be 6 characters long" });
  } else if (password !== password_confirm) {
    res.status(400).json({ msg: "Password's does not match" });
  } else {
    bcrypt.hash(password, rounds, (error, hash) => {
      if (error) res.status(500).json(error);
      else {
        const newUser = User({ email: email, password: hash, name: name });
        newUser
          .save()
          .then((user) => {
            res.status(200).json({ token: generateToken(user._id) });
          })
          .catch((error) => {
            res.status(500).json(error);
          });
      }
    });
  }
});

const generateToken = (user) => {
  return jwt.sign({ data: user }, tokenSecret, { expiresIn: "30m" });
};

module.exports = router;
