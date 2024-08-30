const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  contact: { type: String, required: true },
  email: { type: String, required: true },
  idn: { type: String, required: false },
  purpose: { type: String, required: false },
  dateOfEntry: { type: Date, default: Date.now },
  organization: { type: String, required: true },
  acceptedPOPIA: { type: Boolean, default: false },
  signature: { type: String }, // URL or base64 string of the signature image
  selfie: { type: String }, // URL or base64 string of the selfie image
});

module.exports = mongoose.model("Visitor", visitorSchema);
