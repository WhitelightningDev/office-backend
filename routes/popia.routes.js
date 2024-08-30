const express = require("express");
const router = express.Router();
const popiaController = require("../controllers/popia.controller");

// Route to create a POPIA acceptance record
router.post("/acceptance", popiaController.createAcceptanceRecord);

// Route to get all POPIA questions
router.get("/questions", popiaController.getPopiaQuestions);

// Route to create a new POPIA question
router.post("/questions", popiaController.createPopiaQuestion);

module.exports = router;
