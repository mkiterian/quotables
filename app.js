const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("./config/config");
const mongoose = require("./db/mongoose");
const router = require("./routes");

const app = express();
app.use(bodyParser.json());
const corsOptions = {
  exposedHeaders: 'x-auth',
};
app.use(cors(corsOptions));

app.use("/", router);

module.exports = app;
