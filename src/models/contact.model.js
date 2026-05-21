const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  first_name: { 
    type: String, 
    required: [true, 'First name is required'],
    trim: true
  },
  last_name: {
    type: String,
    trim: true
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  phone_number: {
    type: String,
    trim: true
  },
  company_name: {
    type: String,
    trim: true
  },
  status: { 
    type: String, 
    enum: {
      values: ['Active', 'Inactive'],
      message: 'Status must be Active or Inactive'
    }, 
    default: 'Active' 
  },
  is_deleted: { 
    type: Boolean, 
    default: false,
    select: false 
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Contact', contactSchema);
