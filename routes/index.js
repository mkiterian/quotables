const express = require("express");
const router = express.Router();
const mongoose = require("../db/mongoose");
const { authenticate } = require("../middleware/auth");
const quoteControllers = require("../controllers/quoteControllers");
const userControllers = require("../controllers/userControllers");

router.post("/quotes", authenticate, quoteControllers.createQuote);
router.get("/quotes", authenticate, quoteControllers.readQuotes);
router.get("/quotes/:id", authenticate, quoteControllers.readQuote);
router.patch("/quotes/:id", authenticate, quoteControllers.updateQuote);
router.delete("/quotes/:id", authenticate, quoteControllers.deleteQuote);

router.post("/users", userControllers.createUser);
router.post("/users/login", userControllers.login);
router.delete("/users/logout", authenticate, userControllers.logout);

module.exports = router;
