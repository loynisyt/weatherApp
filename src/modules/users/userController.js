const express = require('express');
const router = express.Router();
const userService = require('./userService');


router.post('/', async (req, res) => {
    const { firstName, lastName, password } = req.body;

    try {
    const id = await userService.createUser(firstName, lastName, password);
    res.status(201).json({ message: 'User created successfully', id });
    } catch (err) {
    res.status(500).json({ message: 'Error creating user' });
    }
});

module.exports = router;

