require("dotenv").config();
const jwt = require("jsonwebtoken");

// Function to generate a token
function generateToken(payload) {
  // Replace 'your-secret-key' with a strong secret key, which you should store in your .env file
  const secretKey = process.env.JWT_SECRET || "your-secret-key";

  // Options for the token, like expiration time
  const options = {
    expiresIn: "30d", // Token expires in 1 hour
  };

  // Generate the token
  const token = jwt.sign(payload, secretKey, options);
  return token;
}

// Example payload
const payload = {
  userId: 123, // Replace with dynamic user data
  username: "john_doe",
};

// Generate and log the token
const token = generateToken(payload);
console.log("Generated Token:", token);
