const PopiaAcceptanceRecord = require("../models/PopiaAcceptanceRecord");
const PopiaQuestion = require("../models/PopiaQuestion");
const Visitor = require("../models/Visitor");

// Controller to create a POPIA acceptance record
exports.createAcceptanceRecord = async (req, res) => {
  try {
    const { visitor_id } = req.body;

    // Ensure visitor exists
    const visitor = await Visitor.findById(visitor_id);
    if (!visitor) {
      return res.status(404).json({ error: "Visitor not found" });
    }

    const acceptanceRecord = new PopiaAcceptanceRecord({ visitor_id });
    await acceptanceRecord.save();

    res.status(201).json({ message: "POPIA acceptance recorded successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Controller to get all POPIA questions
exports.getPopiaQuestions = async (req, res) => {
  try {
    const questions = await PopiaQuestion.find();
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Controller to create a new POPIA question
exports.createPopiaQuestion = async (req, res) => {
  try {
    const { title, question } = req.body;

    const newQuestion = new PopiaQuestion({ title, question });
    await newQuestion.save();

    res.status(201).json({ message: "POPIA question created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
