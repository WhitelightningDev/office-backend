const express = require("express");
const router = express.Router();
const visitorController = require("../controllers/visitor.controller");

// Check if a visitor exists by name and surname
// GET /api/visitors/check
router.get("/check", visitorController.checkVisitorByNameAndSurname); // Use the controller method

// Define routes for CRUD operations
router.post("/", visitorController.createVisitor); // Create a new visitor
router.get("/", visitorController.getAllVisitors); // Get all visitors
router.get("/:id", visitorController.getVisitorById); // Get a single visitor by ID
router.put("/:id", visitorController.updateVisitor); // Update a visitor by ID
router.delete("/:id", visitorController.deleteVisitor); // Delete a visitor by ID

// Optional: Add routes for handling POPIA acceptance and any other specific logic
router.post("/accept-pop", visitorController.acceptPOPIA); // Route to handle POPIA acceptance
router.post("/upload-selfie/:id", visitorController.uploadSelfie); // Route to handle selfie upload
router.post("/upload-signature/:id", visitorController.uploadSignature); // Route to handle signature upload

module.exports = router;
