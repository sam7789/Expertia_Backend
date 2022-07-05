const mongoose = require("mongoose");
require("dotenv").config();
const db = process.env.URI;

const connect = () => {
  mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

module.exports = connect;
