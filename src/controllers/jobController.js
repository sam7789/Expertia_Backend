const express = require("express");
const router = express.Router();
const Job = require("../models/jobSchema");
const Company = require("../models/companySchema");
const User = require("../models/userSchema");
const ApiFeatures = require("../utils/apiFeatures");
const authenticate = require("../middlewares/Authenticate");

router.get("/", async (req, res) => {
  try {
    const resultsPerPage = 10 || req.params.resultsPerPage;
    let Api = new ApiFeatures(Job.find(), req.query)
      .search()
      .sort()
      .paginate(resultsPerPage);
    let jobs = await Api.query
      .populate({
        path: "company",
        ref: "Company",
        select: "name",
      })
      .populate({
        path: "techStack",
        ref: "Tech",
        select: "name",
      });

    return res.status(200).json({ jobs });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { company } = req.body;
    const companyDoc = await Company.findById(company);
    if (!companyDoc) {
      return res
        .status(400)
        .json({ message: "Job already Exists or Company Not Found" });
    }

    let job = await Job.create(req.body);
    companyDoc.update({
      $push: {
        jobs: job._id,
      },
    });

    return res.status(200).json({ job });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

router.patch("/update/:id", async (req, res) => {
  try {
    let job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .populate({
        path: "company",
        model: "Company",
        populate: {
          path: "techStack",
          model: "Tech",
        },
      })
      .lean()
      .exec();
    return res.status(200).json({ job });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    let job = await Job.findByIdAndDelete(req.params.id).lean().exec();
    return res.status(200).json({ job });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

router.post("/:id/apply", authenticate, async (req, res) => {
  try {
    let userid = req.user._id;
    let user = await User.findById(userid);
    let job = await Job.findById(req.params.id);
    if (job.applicants.includes(userid) || user.appliedFor.includes(job._id)) {
      return res.status(400).json({ message: "Already Applied" });
    }
    await job.apply(userid);
    console.log(user.appliedFor);
    await user.applyFor(job._id);
    console.log(user.appliedFor);

    return res.status(200).json({ message: "Applied" });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

module.exports = router;
