const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// ==========================================
// 1. DATABASE CONNECTION
// ==========================================
mongoose
  .connect("mongodb://127.0.0.1:27017/contact-management")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// ==========================================
// 2. MONGOOSE MODEL
// ==========================================
const contactSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: String,
    email: { type: String, required: true },
    phone_number: String,
    company_name: String,
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    is_deleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const Contact = mongoose.model("Contact", contactSchema);

// ==========================================
// 3. ROUTES & CONTROLLERS
// ==========================================

// POST /contacts - Create a new contact
app.post("/contacts", async (req, res) => {
  try {
    const { first_name, email, status } = req.body;

    // Basic Validation
    if (!first_name || !email) {
      return res
        .status(400)
        .json({ success: false, message: "First name and email are required" });
    }

    // Check Duplicate Active Email
    const existing = await Contact.findOne({
      email,
      status: "Active",
      is_deleted: false,
    });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    const contact = await Contact.create(req.body);
    res.status(201).json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /contacts - Get all contacts
app.get("/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find({ is_deleted: false });
    res.status(200).json({ success: true, data: contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /contacts/:id - Get contact by ID
app.get("/contacts/:id", async (req, res) => {
  try {
    const contact = await Contact.findOne({
      _id: req.params.id,
      is_deleted: false,
    });
    if (!contact) {
      return res
        .status(404)
        .json({ success: false, message: "Contact not found" });
    }
    res.status(200).json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /contacts/:id - Update contact
app.put("/contacts/:id", async (req, res) => {
  try {
    const contact = await Contact.findOneAndUpdate(
      { _id: req.params.id, is_deleted: false },
      req.body,
      { new: true },
    );
    if (!contact) {
      return res
        .status(404)
        .json({ success: false, message: "Contact not found" });
    }
    res.status(200).json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /contacts/:id - Soft Delete contact
app.delete("/contacts/:id", async (req, res) => {
  try {
    const contact = await Contact.findOneAndUpdate(
      { _id: req.params.id, is_deleted: false },
      { is_deleted: true },
      { new: true },
    );
    if (!contact) {
      return res
        .status(404)
        .json({ success: false, message: "Contact not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Contact deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 4. START SERVER
// ==========================================
app.listen(5000, () => console.log("Simple Server running on port 5000"));
