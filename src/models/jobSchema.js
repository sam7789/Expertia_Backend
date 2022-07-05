const mongoose = require("mongoose");
const User = require("../models/userSchema");
const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [30, "Title must be less than 30 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: [3, "Description must be at least 3 characters"],
    },
    techStack: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TechStack",
        required: [false, "TechStack is required"],
      },
    ],
    location: {
      type: String,
      required: [true, "Location is required"],
      minlength: [3, "Location must be at least 3 characters"],
      maxlength: [30, "Location must be less than 30 characters"],
    },
    salaryRange: {
      min: {
        type: Number,
        required: [true, "Salary range is required"],
        min: [0, "Salary range must be at least 0"],
        max: [100000, "Salary range must be less than 100000"],
      },
      max: {
        type: Number,
        required: [true, "Salary range is required"],
        min: [0, "Salary range must be at least 0"],
        max: [100000, "Salary range must be less than 100000"],
      },
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company is required"],
    },
    applicants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

jobSchema.methods.apply = async function (userid) {
  let user = await User.findById(userid);
  if (user) {
    await this.applicants.push(userid);
    await this.save();
    await user.applyFor(this._id);
    return;
  }
  return;
};

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
