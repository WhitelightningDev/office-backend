const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

// Function to generate a random API token
function generateApiToken() {
  return crypto.randomBytes(32).toString("hex");
}

// Function to generate a random JWT secret key
function generateJwtSecret() {
  return crypto.randomBytes(64).toString("hex");
}

// Generate tokens
const apiToken = generateApiToken();
const jwtSecret = generateJwtSecret();

// Output the generated tokens
console.log("API Token:", apiToken);
console.log("JWT Secret:", jwtSecret);

// Write the tokens to the .env file
const envPath = path.join(__dirname, ".env");
const envContent = `API_TOKEN=${apiToken}\nJWT_SECRET=${jwtSecret}\n`;

fs.appendFileSync(envPath, envContent, "utf8");
console.log(".env file updated with API_TOKEN and JWT_SECRET");
