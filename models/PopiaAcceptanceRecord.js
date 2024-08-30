const mongoose = require("mongoose");

const popiaAcceptanceRecordSchema = new mongoose.Schema({
  visitor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Visitor" },
  accepted_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model(
  "PopiaAcceptanceRecord",
  popiaAcceptanceRecordSchema
);
