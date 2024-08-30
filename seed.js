require("dotenv").config();
const mongoose = require("mongoose");
const Visitor = require("./models/Visitor");
const PopiaQuestion = require("./models/PopiaQuestion");
const PopiaAcceptanceRecord = require("./models/PopiaAcceptanceRecord");

// Connect to MongoDB using the Office-Users database
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB - Office-Users"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// Function to seed the database
async function seedDatabase() {
  try {
    // Clear existing data
    await Visitor.deleteMany({});
    await PopiaQuestion.deleteMany({});
    await PopiaAcceptanceRecord.deleteMany({});

    // Sample Visitors with idn
    const visitors = [
      {
        idn: "1001", // Provide a value for idn
        name: "John",
        surname: "Doe",
        contact: "1234567890",
        email: "john.doe@example.com",
        purpose: "Meeting",
        dateOfEntry: new Date(),
        selfie: null,
        signature: null,
        organization: "corporate",
        acceptedPOPIA: true,
      },
      {
        idn: "1002", // Provide a value for idn
        name: "Jane",
        surname: "Smith",
        contact: "0987654321",
        email: "jane.smith@example.com",
        purpose: "Interview",
        dateOfEntry: new Date(),
        selfie: null,
        signature: null,
        organization: "tech",
        acceptedPOPIA: false,
      },
    ];

    // Sample POPIA Questions
    const popiaQuestions = [
      {
        title: "Privacy Policy",
        question: "Do you accept the privacy policy?",
      },
      {
        title: "Data Usage",
        question:
          "Do you agree to the use of your data for analytics purposes?",
      },
    ];

    // Sample POPIA Acceptance Records (assuming it has a structure)
    const popiaAcceptanceRecords = [
      {
        idn: "1001", // Using visitor idn for reference
        acceptedQuestions: [
          {
            questionId: "609b1f4b4f1f4c001f8b1234", // Replace with actual question IDs after insertion
            accepted: true,
          },
          {
            questionId: "609b1f4b4f1f4c001f8b5678", // Replace with actual question IDs after insertion
            accepted: true,
          },
        ],
      },
    ];

    // Insert data
    const insertedVisitors = await Visitor.insertMany(visitors);
    const insertedQuestions = await PopiaQuestion.insertMany(popiaQuestions);

    // Update popiaAcceptanceRecords with actual IDs
    const updatedPopiaAcceptanceRecords = popiaAcceptanceRecords.map(
      (record) => ({
        visitorId: insertedVisitors.find((v) => v.idn === record.idn)._id, // Match visitor by idn
        acceptedQuestions: record.acceptedQuestions.map((q, index) => ({
          questionId: insertedQuestions[index]._id, // Match question by index
          accepted: q.accepted,
        })),
      })
    );

    // Insert POPIA acceptance records
    await PopiaAcceptanceRecord.insertMany(updatedPopiaAcceptanceRecords);

    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the seed function
seedDatabase();
