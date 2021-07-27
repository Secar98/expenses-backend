const express = require("express");
const router = express.Router();
const User = require("../models/user");
const middlewear = require("../middlewear");
const bcrypt = require("bcrypt");
const rounds = 10;

const jwt = require("jsonwebtoken");
const tokenSecret = "my-secret-token";

router.get("/jwt-test", middlewear.verify, (req, res) => {
  res.status(200).json(req.user);
});

router.get("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        res.status(404).json({ msg: "no user with that email found" });
      } else {
        bcrypt.compare(password, user.password, (error, match) => {
          if (error) res.status(500).json(error);
          else if (match) res.status(200).json({ token: generateToken });
          else res.status(403).json({ msg: "password does not match" });
        });
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.post("/signup", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const userExists = await User.exists({ email: email });
  if (userExists) {
    res.json({ msg: "User already exists" });
  } else {
    bcrypt.hash(password, rounds, (error, hash) => {
      if (error) res.status(500).json(error);
      else {
        const newUser = User({ email: email, password: hash });
        newUser
          .save()
          .then((user) => {
            res.status(200).json({ token: generateToken(user) });
          })
          .catch((error) => {
            res.status(500).json(error);
          });
      }
    });
  }
});

const generateToken = (user) => {
  return jwt.sign({ data: user }, tokenSecret, { expiresIn: "24h" });
};

module.exports = router;
