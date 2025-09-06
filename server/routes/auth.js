const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @route   POST /api/auth/login
// @desc    Login or Register a user with a unique code
// @access  Public
router.use(express.json());
router.post('/login', async (req, res) => {
    const { uniqueCode } = req.body;

    if (!uniqueCode) {
        return res.status(400).json({ msg: 'Please provide a unique code.' });
    }

    try {
        let user = await User.findOne({ uniqueCode });

        // If user doesn't exist, create a new one
        if (!user) {
            user = new User({ uniqueCode });
            await user.save();
        }

        // Create and sign a JWT
        const payload = {
            user: {
                id: user.id,
                uniqueCode: user.uniqueCode
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '7d' }, // Token expires in 7 days
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;