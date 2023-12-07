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

// Deposit function
async function deposit(req, res) {
  try {
    const { accountNumber, amount } = req.body;

    // update account balance
    const account = await Account.findOne({ accountNumber: accountNumber });

    if (!account) {
      return res.status(500).json({ message: "Invalid account number" });
    }

    const depositAmount = parseFloat(amount);
    account.balance += depositAmount;
    account.transactions.push({
      accountNumber,
      type: "deposit",
      amount: depositAmount,
    });
    await account.save();

    // Recording the Transaction
    // const transaction = new Transaction({
    //   accountNumber,
    //   type: "deposit",
    //   amount: depositAmount,
    // });
    // await transaction.save();

    res.json({ message: "Deposit successful", balance: account.balance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error processing deposit" });
  }
}

// Withdraw funciton
async function withdraw(req, res) {
  try {
    const { accountNumber, amount } = req.body;
    const account = await Account.findOne({ accountNumber: accountNumber });

    if (!account) {
      return res.status(500).json({ message: "Invalid account number" });
    }

    const withdrawAmount = parseFloat(amount);

    if (account.balance < withdrawAmount) {
      return res.status(400).json({ error: "Insufficent Funds" });
    }
    account.balance -= withdrawAmount;
    account.transactions.push({
      accountNumber,
      type: "withdrawal",
      amount: withdrawAmount,
    });
    await account.save();

    // const transaction = new Transaction({
    //   accountNumber,
    //   type: "withdrawal",
    //   amount: withdrawAmount,
    // });
    // await transaction.save();
    res.json({ message: "Withdrawal successful", balance: account.balance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error in processing the withdrawal" });
  }
}

async function customerHistory(req, res) {
  try {
    const accountId = req.params.accountId;
    const transactions = await Transaction.find({ accountId }).sort({
      timestamp: -1,
    });
    res.json(transactions);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching transaction history" });
  }
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
  deposit,
  authenticateToken,
  withdraw,
  customerHistory,
};
