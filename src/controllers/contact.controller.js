const Contact = require("../models/contact.model");

// POST /contacts
const createContact = async (req, res) => {
  try {
    const { first_name, email, status, last_name, phone_number, company_name }=req.body;

    if (!first_name || !email) {
      return res
        .status(400)
        .json({ success: false, message: "First name and email are required" });
    }

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

    const contact = new Contact(req.body);
    await contact.save();

    res.status(201).json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getContacts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // 1. Build Filter
    const filter = { is_deleted: false };
    if (status) {
      filter.status = status;
    }

    // 2. Add Search rules
    if (search) {
      // mongoose $or with regex for case-insensitive search on first_name, last_name, and email
      filter.$or = [
        { first_name: { $regex: search, $options: "i" } },
        { last_name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // 3. Add Sort rules
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    // 4. Calculate Pagination offsets
    const skipAmount = (parseInt(page) - 1) * parseInt(limit);

    // 5. Fetch contacts matching queries
    const contacts = await Contact.find(filter)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(parseInt(limit));

    const count = await Contact.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: contacts,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /contacts/:id
const getContactById = async (req, res) => {
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
};

// PUT /contacts/:id
const updateContact = async (req, res) => {
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
};

// DELETE /contacts/:id
const deleteContact = async (req, res) => {
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
};

module.exports = {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
};
