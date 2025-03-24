const mongoose = require('mongoose');

const connectDB = async (uri) => {
    try {
        const conn = await mongoose.connect(uri || process.env.MONGODB_URI || 'mongodb://localhost:27017/test');

        return conn;
    } catch (error) {

        process.exit(1);
    }
};

module.exports = connectDB; 