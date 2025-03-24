const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

// Check if model exists before creating
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User; 