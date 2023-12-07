const mongoose = require("mongoose");

// Transaction Schema
const transSchema = new mongoose.Schema({
  accountNumber: {
    type: String,
    ref: "Account",
    required: true,
  },
  type: {
    type: String,
    enum: ["deposit", "withdrawal"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Account Schema
const accSchema = new mongoose.Schema(
  {
    accountNumber: {
      type: String,
      unique: true,
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    transactions: [
      // { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
      transSchema,
    ],
  },
  { timestamps: true }
);

const Account = mongoose.model("Account", accSchema);
// const Transaction = mongoose.model("Transaction", transSchema);
module.exports = { Account };
