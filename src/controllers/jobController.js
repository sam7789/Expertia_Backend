const express = require("express");
const router = express.Router();
const Job = require("../models/jobSchema");
const Company = require("../models/companySchema");
const User = require("../models/userSchema");
const authenticate = require("../middlewares/Authenticate");

router.get("/", async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 5;
  const search = req.query.q || "";
  const sortBy = req.query.sortBy || "createdAt";
  const sortOrder = req.query.sortOrder || "asc";
  try {
    let option = {};
    if (search !== "") {
      option = { title: { $regex: search, $options: "i" } };
    }
    let order;

    if (sortOrder === "asc") {
      order = 1;
    } else {
      order = -1;
    }
    let sort = {
      [sortBy]: order,
    };
    const jobs = await Job.find(option)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({
        path: "company",
        select: "name",
      })
      .populate({
        path: "techStack",
        ref: "Tech",
        select: "name",
      })
      .sort(sort);

    const totaldocument = await Job.find(option).countDocuments();
    const total = Math.ceil(totaldocument / limit);

    return res.status(200).json({ jobs, total });
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

router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
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
