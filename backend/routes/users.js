const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = function (usersCollection) {
    const router = express.Router();

    // Register a new user (Admin registers users)
    // Register a new user
    router.post('/register', async (req, res) => {
        let { mobileNumber, password, name, role = 'admin' } = req.body;

        // Trim any extra spaces from the name
        name = name.trim();

        if (!name || !mobileNumber || !password) {
            return res.status(400).json({ message: 'Name, Mobile Number, and Password are required' });
        }

        try {
            const existingUser = await usersCollection.findOne({ userId: mobileNumber });
            if (existingUser) {
                // Provide more detail in the response for existing users
                return res.status(400).json({ message: `User with mobile number ${mobileNumber} already exists` });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = { mobileNumber, userId: mobileNumber, password: hashedPassword, name, role };  // Include 'name' in the user object
            await usersCollection.insertOne(user);

            res.json({ message: 'User registered successfully' });
        } catch (error) {
            console.error('Error registering user:', error);  // Log detailed error for debugging
            res.status(500).json({ message: 'Error registering user', error });
        }
    });




    // Login route
    router.post('/login', async (req, res) => {
        const { mobileNumber, password } = req.body;

        try {
            // Find the user by mobile number
            const user = await usersCollection.findOne({ userId: mobileNumber });
            if (!user) return res.status(400).json({ message: 'User not found' });

            // Compare passwords
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

            // Generate JWT token
            const token = jwt.sign({ userId: user._id, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });
            res.json({ token, role: user.role });
        } catch (error) {
            res.status(500).json({ message: 'Error logging in', error });
        }
    });


    router.post('/admin/register', async (req, res) => {
        const { mobileNumber, password, role } = req.body;

        try {
            // Ensure only admins can access this route
            const token = req.headers['authorization'];
            if (!token) return res.status(401).json({ message: 'Unauthorized' });

            const decoded = jwt.verify(token, 'your_jwt_secret');
            if (decoded.role !== 'admin') return res.status(403).json({ message: 'Forbidden: Only admins can register users' });

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = { mobileNumber, password: hashedPassword, role: 'user' };  // Registered users are 'user'

            const existingUser = await usersCollection.findOne({ mobileNumber });
            if (existingUser) return res.status(400).json({ message: 'User already exists' });

            await usersCollection.insertOne(newUser);
            res.json({ message: 'User registered successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error registering user', error });
        }
    });



    return router;
};

