const mongoose = require('mongoose');

const connectDB = async (uri) => {
    try {
        const conn = await mongoose.connect(uri || process.env.MONGODB_URI || 'mongodb://localhost:27017/test');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB; 