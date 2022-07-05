const express = require("express");

const router = express.Router();
const Tech = require("../models/techSchema");

router.get("/", async (req, res) => {
  try {
    let techs = await Tech.find().lean().exec();
    return res.status(200).json({ techs });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    let tech = await Tech.create(req.body);
    return res.status(200).json({ tech });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    let tech = await Tech.findById(req.params.id).lean().exec();
    return res.status(200).json({ tech });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

router.patch("/update/:id", async (req, res) => {
  try {
    let tech = await Tech.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .lean()
      .exec();
    return res.status(200).json({ tech });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    let tech = await Tech.findByIdAndDelete(req.params.id).lean().exec();
    return res.status(200).json({ tech });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

module.exports = router;
