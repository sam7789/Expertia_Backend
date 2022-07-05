const express = require("express");

const router = express.Router();
const Company = require("../models/companySchema");

router.get("/", async (req, res) => {
  try {
    let companies = await Company.find().lean().exec();
    return res.status(200).json({ companies });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    let company = await Company.create(req.body);
    return res.status(200).json({ company });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    let company = await Company.findById(req.params.id).lean().exec();
    return res.status(200).json({ company });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

router.patch("/update/:id", async (req, res) => {
  try {
    let company = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .lean()
      .exec();
    return res.status(200).json({ company });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    let company = await Company.findByIdAndDelete(req.params.id).lean().exec();
    return res.status(200).json({ company });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

module.exports = router;
