const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/contact-management');
        console.log('Connected to MongoDB ✅');
    } catch (error) {
        console.error('Could not connect to MongoDB', error);
        process.exit(1); 
    }
};

module.exports = connectDB;