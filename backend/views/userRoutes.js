const express = require("express");
const router = express.Router();
const userController = require("./../controllers/userController");

// Signup route
router.post("/register", userController.register);

// Login route
router.post("/login/customer", userController.customerLogin);

// Banker login
router.post("/login/banker", userController.bankerLogin);

// Home route
// router.get("/home", authenticateToken, userController.getHomeData);

// Add other routes as needed

// Middleware to authenticate the access token
// function authenticateToken(req, res, next) {
//   // ... (your existing authentication middleware)
// }

module.exports = router;
