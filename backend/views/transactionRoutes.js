const express = require("express");
const router = express.Router();
const transactionControllers = require("./../controllers/transactionControllers");

// Deposit route
router.post(
  "/transactions/deposit",
  transactionControllers.authenticateToken,
  transactionControllers.deposit
);

// Withdraw Route
router.post(
  "/transactions/withdraw",
  transactionControllers.authenticateToken,
  transactionControllers.withdraw
);

router.get(
  "transactions/history/:accountId",
  transactionControllers.authenticateToken,
  transactionControllers.customerHistory
);

module.exports = router;
