const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userSchema");
require("dotenv").config();

const generateToken = (user) => {
  return jwt.sign({ user }, process.env.JWT_SECRET);
};

const register = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).send({ message: "User already exists" });
    }
    user = await User.create(req.body);
    const token = generateToken(user);
    return res.status(200).send({ user, token });
  } catch (e) {
    return res.status(500).send({ message: e.message });
  }
};

const login = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).send({ message: "Wrong Email or Password" });
    }

    let match = await user.checkPassword(req.body.password);

    if (!match) {
      return res.status(400).send({ message: "Wrong Email or PassWord" });
    }

    const token = generateToken(user);

    return res.status(200).send({ user, token });
  } catch (e) {
    return res.status(500).send({ message: e.message });
  }
};

const token = async (req, res) => {
  // check token
  try {
    const userToken = req.header("Authorization").replace("Bearer ", ""); // get token
    const user = jwt.verify(userToken, process.env.KEY); // verify token
    return res.status(200).send({ user, token }); // return user
  } catch (e) {
    return res.status(500).send({ message: e.message }); // return error
  }
};

module.exports = { register, login, token };
