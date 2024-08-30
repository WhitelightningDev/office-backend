const Visitor = require("../models/Visitor");
const PopiaAcceptanceRecord = require("../models/PopiaAcceptanceRecord"); // Import your POPIA model
const multer = require("multer");
const path = require("path");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Set your upload destination
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename
  },
});

const upload = multer({ storage });

// Create a new visitor
exports.createVisitor = async (req, res) => {
  try {
    const { selfieImage, signatureImage, ...visitorData } = req.body;

    // Save the visitor data without images first
    const visitor = new Visitor(visitorData);

    // Save the selfie and signature images
    if (selfieImage) {
      visitor.selfie = selfieImage; // Save Base64 string of selfie
    }
    if (signatureImage) {
      visitor.signature = signatureImage; // Save Base64 string of signature
    }

    await visitor.save();

    res.status(201).json({
      message: "Visitor created successfully",
      visitorId: visitor._id, // Return the created visitor's ID
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all visitors
exports.getAllVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find();
    res.status(200).json(visitors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single visitor by ID
exports.getVisitorById = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) {
      return res.status(404).json({ message: "Visitor not found" });
    }
    res.status(200).json(visitor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Check if a visitor exists by name and surname
exports.checkVisitorByNameAndSurname = async (req, res) => {
  const { name, surname } = req.query; // Extract name and surname from query parameters

  // Validate that name and surname are provided
  if (!name || !surname) {
    return res.status(400).json({ error: "Name and surname are required." });
  }

  try {
    const visitor = await Visitor.findOne({ name, surname });
    if (visitor) {
      res.json({
        exists: true,
        visitor: {
          name: visitor.name,
          surname: visitor.surname,
          email: visitor.email,
          idn: visitor.idn,
          contact: visitor.contact,
          organization: visitor.organization,
        },
      });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error("Error checking visitor:", error); // Log the error
    res.status(500).json({ message: error.message });
  }
};

// Update a visitor by ID
exports.updateVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!visitor) {
      return res.status(404).json({ message: "Visitor not found" });
    }
    res.status(200).json({
      message: "Visitor updated successfully",
      visitor,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a visitor by ID
exports.deleteVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findByIdAndDelete(req.params.id);
    if (!visitor) {
      return res.status(404).json({ message: "Visitor not found" });
    }
    res.status(200).json({
      message: "Visitor deleted successfully",
      visitor,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Handle POPIA acceptance
exports.acceptPOPIA = async (req, res) => {
  try {
    const { visitorId } = req.body; // Assume visitor ID is passed in the request body

    // Create a new POPIA acceptance record
    const popiaAcceptance = new PopiaAcceptanceRecord({
      visitor_id: visitorId,
      accepted_at: Date.now(),
    });

    await popiaAcceptance.save();

    // Update the visitor record if needed
    await Visitor.findByIdAndUpdate(visitorId, { popiaAccepted: true });

    res.status(200).json({
      message: "POPIA accepted successfully",
      popiaAcceptance,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Upload selfie
exports.uploadSelfie = async (req, res) => {
  upload.single("selfie")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const visitor = await Visitor.findById(req.params.id);
      if (!visitor) {
        return res.status(404).json({ message: "Visitor not found" });
      }

      // Assuming you have a field for selfie in the Visitor model
      visitor.selfie = req.file.path; // Store the path of the uploaded selfie
      await visitor.save();

      res.status(200).json({
        message: "Selfie uploaded successfully",
        visitor,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

// Upload signature
exports.uploadSignature = async (req, res) => {
  upload.single("signature")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const visitor = await Visitor.findById(req.params.id);
      if (!visitor) {
        return res.status(404).json({ message: "Visitor not found" });
      }

      // Assuming you have a field for signature in the Visitor model
      visitor.signature = req.file.path; // Store the path of the uploaded signature
      await visitor.save();

      res.status(200).json({
        message: "Signature uploaded successfully",
        visitor,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};
