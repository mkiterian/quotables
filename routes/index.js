const express = require("express");
const router = express.Router();
const mongoose = require("../db/mongoose");
const { authenticate } = require("../middleware/auth");
const quoteControllers = require("../controllers/quoteControllers");
const authControllers = require("../controllers/authControllers");

router.post("/users", authControllers.register);
router.post("/users/login", authControllers.login);
router.delete("/users/logout", authenticate, authControllers.logout);

router.post("/quotes", authenticate, quoteControllers.createOne);
router.get("/quotes", authenticate, quoteControllers.getAll);
router.get("/quotes/:id", authenticate, quoteControllers.getOne);
router.patch("/quotes/:id", authenticate, quoteControllers.updateOne);
router.delete("/quotes/:id", authenticate, quoteControllers.deleteOne);

module.exports = router;
