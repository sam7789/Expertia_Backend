const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [3, "Name must be at least 3 characters"],
      maxlength: [30, "Name must be less than 30 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      minlength: [3, "Email must be at least 3 characters"],
      maxlength: [30, "Email must be less than 30 characters"],
      unique: [true, "Email must be unique"],
      validate: [validator.isEmail, "Email is invalid"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [3, "Password must be at least 3 characters"],
      maxlength: [70, "Password must be less than 30 characters"],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
      required: false,
    },
    imageLink: {
      type: String,
      required: false,
    },
    appliedFor: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: false,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(this.password, salt);
  this.password = hash;
  return next();
});

userSchema.methods.checkPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.applyFor = async function (job) {
  await this.appliedFor.push(job);
  await this.save();
  return;
};

module.exports = mongoose.model("User", userSchema);
