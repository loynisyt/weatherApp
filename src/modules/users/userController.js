const express = require('express');
const router = express.Router();
const userService = require('./userService');


router.post('/create', async (req, res) => {
    const { firstName, lastName, login, password } = req.body;
    if (password.length < 8) {
        return res.status(400).json({ message: "Please insert a password with at least 8 characters" });
    }

    try {
    const id = await userService.createUser(firstName, lastName, login, password);
    res.status(201).json({ message: 'User created successfully', id });
    } catch (err) {
    res.status(500).json({ message: 'Error creating user' });
    }
});

router.post('/login-password', async (req, res) => {
    const { login, password } = req.body
    try{
        const user = await userService.loginUser(login , password)
        res.status(200).json({message:"acces granted, welcome user: ", user })
    }catch{
        res.status(401).json({message:"Invalid login or password, try again"})
    }
})

router.post('/create-token', async (req, res) => {
    const { login, password } = req.body;

    try {
    const { token, expiresAt } = await userService.createToken(login, password);
    res.status(201).json({ message: 'Token created successfully', token, expiresAt });
    } catch (err) {
    res.status(500).json({ message: 'Error creating token' });
    }
});

router.post('/login-token', async (req, res) => {
    const { token } = req.body;

    try {
    const user = await userService.loginWithToken(token);
    res.status(200).json({ message: 'Login successful', user });
    } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
    }
});



module.exports = router;

