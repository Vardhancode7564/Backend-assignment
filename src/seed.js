require("dotenv").config();
const mongoose = require("mongoose");
const Contact = require("./models/contact.model");

const sampleContacts = [
  { first_name: "Amit", last_name: "Sharma", email: "amit@example.com", phone_number: "9876543210", company_name: "Tech Solutions", status: "Active" },
  { first_name: "Priya", last_name: "Singh", email: "priya.singh@example.com", phone_number: "8765432109", company_name: "Innovate INC", status: "Active" },
  { first_name: "John", last_name: "Doe", email: "john.doe@test.com", phone_number: "555-0123", company_name: "Global Corp", status: "Inactive" },
  { first_name: "Sarah", last_name: "Connor", email: "sarah.c@cyberdyne.com", phone_number: "555-9876", company_name: "Cyberdyne Systems", status: "Active" },
  { first_name: "Raj", last_name: "Patel", email: "raj.patel@startup.com", phone_number: "7654321098", company_name: "Startup Hub", status: "Active" },
  { first_name: "Elon", last_name: "Musk", email: "elon@spacex.com", phone_number: "111222333", company_name: "SpaceX", status: "Active" },
  { first_name: "Bill", last_name: "Gates", email: "bill@windows.com", phone_number: "222333444", company_name: "Microsoft", status: "Inactive" },
  { first_name: "Sundar", last_name: "Pichai", email: "sundar@google.com", phone_number: "333444555", company_name: "Google", status: "Active" },
  { first_name: "Satya", last_name: "Nadella", email: "satya@microsoft.com", phone_number: "444555666", company_name: "Microsoft", status: "Active" },
  { first_name: "Tim", last_name: "Cook", email: "tim@apple.com", phone_number: "555666777", company_name: "Apple", status: "Active" },
  { first_name: "Mark", last_name: "Zuckerberg", email: "mark@meta.com", phone_number: "666777888", company_name: "Meta", status: "Inactive" },
  { first_name: "Jeff", last_name: "Bezos", email: "jeff@amazon.com", phone_number: "777888999", company_name: "Amazon", status: "Active" }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/contact-management");
    console.log("Connected to MongoDB for Seeding...");

    await Contact.deleteMany({});
    console.log("Cleared existing contacts.");

    await Contact.insertMany(sampleContacts);
    console.log("12 new sample contacts injected successfully!");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedDatabase();
