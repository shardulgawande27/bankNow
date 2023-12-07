const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./../models/userSchema");
const { Account } = require("./../models/accSchema");
// const userRoutes = require("./views/userRoutes");
// const { Transaction } = require("./models/accSchema");
require("dotenv").config();

// secret key for JWT token in env file
const SECRET_KEY = process.env.SECRET_KEY;

async function customers(req, res) {
  const { userId, role } = req.user;

  try {
    if (role !== "banker") {
      return res.status(403).json({ error: "Access forbidden" });
    }

    const banker = await User.findById(userId, "username");

    const customers = await User.find({ role: "customer" }).populate({
      path: "accounts",
      populate: {
        path: "transactions",
      },
    });

    res.json({
      banker: {
        userId,
        username: banker.username,
        role,
      },
      customers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching the customer details" });
  }
}

async function home(req, res) {
  const { userId, role } = req.user;

  if (role !== "customer") {
    return res.status(403).json({ error: "Access forbidden" });
  }

  User.findById(userId)
    .populate({
      path: "accounts",
      populate: {
        path: "transactions",
      },
    })
    .then((user) => {
      if (!user) {
        return res.status(500).json({ error: "Error fetching user details" });
      }

      const { username, accounts } = user;
      const accountDetails = accounts.map((account) => ({
        accountNumber: account.accountNumber,
        balance: account.balance,
        transaction: account.transactions,
      }));

      res.json({
        username,
        accountDetails,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "error fetching the user details" });
    });
}

//   Token authentication
function authenticateToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Access token not provided" });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      console.error("JWT error", err);
      return res.status(403).json({ error: "Invalid token" });
    }

    if (user.role !== "customer" && user.role !== "banker") {
      return res.status(403).json({ error: "Unauthorized" });
    }
    req.user = user;
    next();
  });
}

module.exports = {
  customers,
  home,
  authenticateToken,
};
