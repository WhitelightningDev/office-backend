const mongoose = require("mongoose");

const popiaQuestionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  question: { type: String, required: true },
});

module.exports = mongoose.model("PopiaQuestion", popiaQuestionSchema);
