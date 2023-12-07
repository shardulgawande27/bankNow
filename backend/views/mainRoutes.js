const express = require("express");
const router = express.Router();
const mainControllers = require("./../controllers/mainControllers");

router.get(
  "/customers",
  mainControllers.authenticateToken,
  mainControllers.customers
);

router.get("/home", mainControllers.authenticateToken, mainControllers.home);

module.exports = router;
