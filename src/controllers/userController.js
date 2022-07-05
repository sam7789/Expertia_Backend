const express = require("express");
const router = express.Router();
const User = require("../models/userSchema");

router.get("/applied", async (req, res) => {
  try {
    let users = await User.find().lean().exec();
    return res.status(200).json({ Applied: users.appliedFor });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

module.exports = router;
