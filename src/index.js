const express = require("express");
const app = express();
const cors = require("cors");
const UserController = require("./controllers/userController");
const TechController = require("./controllers/techController");
const CompanyController = require("./controllers/companyController");
const JobController = require("./controllers/jobController");
const { login, register, token } = require("./controllers/AuthController");
app.use(cors());
app.use(express.json());

app.use("/api/users", UserController);
app.use("/api/techs", TechController);
app.use("/api/companies", CompanyController);
app.use("/api/jobs", JobController);
app.post("/api/auth", login);
app.post("/api/token", token);
app.post("/api/register", register);

module.exports = app;
