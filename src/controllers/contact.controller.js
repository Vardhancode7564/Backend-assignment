const Contact = require("../models/contact.model");

// POST /contacts
const createContact = async (req, res, next) => {
  try {
    const { first_name, email, status, last_name, phone_number, company_name } =
      req.body;

    if (!first_name || !email) {
      const error = new Error("First name and email are required");
      error.statusCode = 400;
      return next(error);
    }

    const existing = await Contact.findOne({
      email,
      status: "Active",
      is_deleted: false,
    });
    if (existing) {
      const error = new Error("Email already exists");
      error.statusCode = 400;
      return next(error);
    }

    const contact = new Contact(req.body);
    await contact.save();

    res.status(201).json({ success: true, data: contact });
  } catch (error) {
    next(error);
  }
};

const getContacts = async (req, res, next) => {
  try {
    let {
      page = 1,
      limit = 10,
      search,
      status,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Validate Pagination values
    page = parseInt(page);
    limit = parseInt(limit);
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;
    if (limit > 100) limit = 100; // max limit safeguard

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
    const skipAmount = (page - 1) * limit;

    // 5. Fetch contacts matching queries
    const contacts = await Contact.find(filter)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(limit);

    const count = await Contact.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: contacts,
      pagination: {
        total: count,
        page: page,
        limit: limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /contacts/:id
const getContactById = async (req, res, next) => {
  try {
    const contact = await Contact.findOne({
      _id: req.params.id,
      is_deleted: false,
    });
    if (!contact) {
      const error = new Error("Contact not found");
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json({ success: true, data: contact });
  } catch (error) {
    next(error);
  }
};

// PUT /contacts/:id
const updateContact = async (req, res, next) => {
  try {
    if (req.body.email) {
      const existing = await Contact.findOne({
        email: req.body.email,
        status: "Active",
        _id: { $ne: req.params.id },
        is_deleted: false,
      });

      if (existing) {
        const error = new Error(
          "Email already exists for another active contact",
        );
        error.statusCode = 400;
        return next(error);
      }
    }

    const contact = await Contact.findOneAndUpdate(
      { _id: req.params.id, is_deleted: false },
      req.body,
      { new: true, runValidators: true },
    );
    if (!contact) {
      const error = new Error("Contact not found");
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json({ success: true, data: contact });
  } catch (error) {
    next(error);
  }
};

// DELETE /contacts/:id
const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findOneAndUpdate(
      { _id: req.params.id, is_deleted: false },
      { is_deleted: true },
      { new: true },
    );
    if (!contact) {
      const error = new Error("Contact not found");
      error.statusCode = 404;
      return next(error);
    }
    res
      .status(200)
      .json({ success: true, message: "Contact deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
};
