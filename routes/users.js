const express = require('express');
const User = require('../models/UserModel');
const router = express.Router();

router.get('/', async (req, res) => {
    const users = await User.find();

    res.json({ data: users, message: 'Welcome to the API' });
});

router.post('/', (req, res) => {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    user.save();
    res.json(user);
});

module.exports = router;