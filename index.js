require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const visitorRoutes = require("./routes/visitor.routes"); // Import visitor routes
const popiaRoutes = require("./routes/popia.routes"); // Import POPIA routes
const app = express();
const port = 3000;

// Middleware
app.use(cors()); // Enable CORS

// Increase the limit for JSON payloads to, for example, 4000mb
app.use(bodyParser.json({ limit: "4000mb" }));

// Increase the limit for URL-encoded data
app.use(bodyParser.urlencoded({ limit: "4000mb", extended: true }));

// Connect to MongoDB using the connection string from the .env file
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// Function to generate a token based on visitor data
function generateToken(visitor) {
  const secretKey = process.env.JWT_SECRET || "your-secret-key";
  const payload = {
    visitorId: visitor._id,
    name: visitor.name,
    surname: visitor.surname,
    email: visitor.email,
    organization: visitor.organization,
  };
  const options = {
    expiresIn: "30d", // Token expires in 30 days
  };
  const token = jwt.sign(payload, secretKey, options);
  return token;
}

// Use visitor routes for CRUD operations
app.use("/api/visitors", visitorRoutes);

// Use POPIA routes for POPIA-related operations
app.use("/api/popia", popiaRoutes); // Use POPIA routes

// Route to create a new visitor and generate a token (if needed separately)
app.post("/api/visitors/token", async (req, res) => {
  try {
    const visitor = new Visitor(req.body);
    await visitor.save();

    // Generate a token for the newly created visitor
    const token = generateToken(visitor);

    res.status(201).json({
      message: "Visitor created and token generated",
      visitor: visitor,
      token: token,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Root route
app.get("/", (req, res) => {
  const response = {
    message: "Welcome to the Visitor Management API!",
    version: "1.0.0", // Specify your API version
    description:
      "This API allows you to manage visitor registrations, including their details and consent under the POPIA Act.",
    endpoints: [
      {
        method: "GET",
        path: "/api/visitors",
        description: "Retrieve a list of all registered visitors.",
      },
      {
        method: "POST",
        path: "/api/visitors",
        description: "Register a new visitor.",
      },
      {
        method: "POST",
        path: "/api/visitors/token",
        description:
          "Create a new visitor and generate a token for authentication.",
      },
      {
        method: "GET",
        path: "/api/popia",
        description: "Retrieve POPIA-related information.",
      },
      {
        method: "POST",
        path: "/api/popia/accept",
        description: "Accept the POPIA terms.",
      },
    ],
    contact: {
      email: "daniel@mabureau.co.za", // Replace with actual support email
      phone: "+27 74 658 885", // Replace with actual support phone number
    },
    documentation:
      "For more information, visit our API documentation at https://example.com/api-docs", // Replace with actual documentation link
  };

  res.status(200).json(response); // Return the comprehensive response in JSON format
});

// Start the server
app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
