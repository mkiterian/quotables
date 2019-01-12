const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const quoteControllers = require("../controllers/quoteControllers");
const authControllers = require("../controllers/authControllers");
const validateObjectId = require("../utils/vaildateObjectId");

router.post("/users", authControllers.register);
router.post("/users/login", authControllers.login);
router.delete("/users/logout", authenticate, authControllers.logout);

router.post("/quotes", authenticate, quoteControllers.createOne);
router.get("/quotes", authenticate, quoteControllers.getAll);
router.get(
  "/quotes/:id",
  authenticate,
  validateObjectId,
  quoteControllers.getOne
);
router.patch(
  "/quotes/:id",
  authenticate,
  validateObjectId,
  quoteControllers.updateOne
);
router.delete(
  "/quotes/:id",
  authenticate,
  validateObjectId,
  quoteControllers.deleteOne
);

module.exports = router;
