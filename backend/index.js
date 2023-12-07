const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const userRoutes = require("./views/userRoutes");
const transactionRoutes = require("./views/transactionRoutes");
const mainRoutes = require("./views/mainRoutes");
require("dotenv").config();

// secret key for JWT token in env file
const SECRET_KEY = process.env.SECRET_KEY;

//  using express
const app = express();

// connect to mongoDB

mongoose
  .connect(process.env.bankDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(3001, () => {
      console.log("Server is conneted on port 3001");
    });
  })
  .catch((error) => {
    console.log("Unable to connect to the server");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/", userRoutes);
app.use("/", transactionRoutes);
app.use("/", mainRoutes);
