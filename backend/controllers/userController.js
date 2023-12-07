const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./../models/userSchema");
const { Account } = require("./../models/accSchema");
require("dotenv").config();

// signup route

const SECRET_KEY = process.env.SECRET_KEY;

async function register(req, res) {
  try {
    console.log("Received registration request:", req.body);
    const { email, username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email: email,
      username: username,
      password: hashedPassword,
      role: role,
    });
    await newUser.save();

    // creating a new account for the user
    if (role === "customer") {
      const newAccount = new Account({
        accountNumber: generateAccountNumber(),
        balance: 0,
      });

      await newAccount.save();

      newUser.accounts.push(newAccount._id);
      await newUser.save();

      res.status(201).json({
        message: "User created successfully",
        accountNumber: newAccount.accountNumber,
      });
    } else if (role === "banker") {
      res.status(201).json({
        message: "Banker created successfully",
      });
    } else {
      res.status(400).json({
        error: "Invalid role specified",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error sigining up" });
  }
}

// Function to generate a random 6-digit account number
function generateAccountNumber() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// To see all the registered users
// app.get("/register", async (req, res) => {
//   try {
//     const users = await User.find();
//     res.status(201).json(users);
//   } catch (error) {
//     res.status(500).json({ error: "Unable to get the user" });
//   }
// });

// Customer Login Route
async function customerLogin(req, res) {
  try {
    const { username, password } = req.body;

    // Check if username is valid
    const validUser = await User.findOne({
      username,
      role: "customer",
    }).populate("accounts");
    if (!validUser) {
      return res.status(401).json({ error: "Invalid Username" });
    }
    // Check if password is valid
    const validPassword = await bcrypt.compare(password, validUser.password);

    if (!validPassword) {
      res.status(401).json({ message: "Invalid Password" });
    }

    // Access token generation
    const token = jwt.sign(
      { userId: validUser._id, role: "customer" },
      SECRET_KEY,
      {
        expiresIn: "3h",
        algorithm: "HS256",
      }
    );

    const accountNumber = validUser.accounts[0].accountNumber;

    res.json({
      message: "Customer Login successful",
      token,
      accountNumber,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error signing in the customer" });
  }
}

// Banker Login
 async function bankerLogin (req, res) {
    try {
      const { username, password } = req.body;
  
      // If username is a valid banker
      const validBanker = await User.findOne({ username, role: "banker" });
  
      if (!validBanker) {
        return res.status(401).json({ message: "Invalid Banker Username" });
      }
  
      const validPassword = await bcrypt.compare(password, validBanker.password);
  
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid Password" });
      }
  
      const token = jwt.sign(
        {
          userId: validBanker._id,
          role: "banker",
        },
        SECRET_KEY,
        { expiresIn: "3h", algorithm: "HS256" }
      );
  
      res.json({ message: "Banker Login successful", token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error signing in the banker" });
    }
  };

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
  register,
  customerLogin,
  bankerLogin
};
