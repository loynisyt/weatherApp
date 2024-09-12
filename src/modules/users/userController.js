const express = require('express');
const router = express.Router();
const userService = require('./userService');

const isAuthorizedMiddleware = userService.isAuthorizedMiddleware;

router.post('/create', async (req, res) => {
    const { firstName, lastName, login, password } = req.body;
    if (password.length < 8) {
        return res.status(400).json({ message: "Please insert a password with at least 8 characters" });
    }

    try {
        const userId = await userService.createUser(firstName, lastName, login, password);
        const token = await userService.loginUser(login, password);
        res.status(201).json({ message: 'User created successfully. Log in to see your token', firstName, lastName });
    } catch (err) {
        res.status(500).json({ message: 'Error creating user' });
    }
});
router.post('/login', async (req, res) => {
    const { login, password } = req.body;
    try {
        const token = await userService.loginUser(login, password);
        res.status(200).json({ token });
    } catch (err) {
        res.status(401).json({ message: 'Invalid login or password' });
    }
});

router.put('/update', isAuthorizedMiddleware, async (req, res) => {
    const { firstName, lastName, login } = req.body;
    const userId = req.userId;

    try {
        await userService.updateUser(userId, firstName, lastName, login);
        res.status(200).json({ message: 'User updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating user' });
    }
});


router.delete('/delete', isAuthorizedMiddleware, async (req, res) => {
    const userId = req.userId;

    try {
        await userService.deleteUser(userId);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting user' });
    }
});





module.exports = router ;
