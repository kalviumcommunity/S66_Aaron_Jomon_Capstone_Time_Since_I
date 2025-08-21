const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const authenticateToken = require("../middleware/auth");

const router = express.Router();

router.get("/", (req, res) => {
    res.send("User API is working!");
});

// Get current user profile
router.get("/profile", authenticateToken, async (req, res) => {
    try {
        res.status(200).json({ user: req.user });
    } catch (error) {
        res.status(500).json({ message: "Error fetching user profile", error: error.message });
    }
});

// Get all users
router.get("/all", async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving users", error: error.message });
    }
});

// Update User Profile
router.put("/profile", authenticateToken, async (req, res) => {
    try {
        const { username, email } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (username !== undefined) user.username = username;
        if (email !== undefined) user.email = email;

        await user.save();
        const updatedUser = await User.findById(req.user._id).select('-password');
        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Error updating user", error: error.message });
    }
});

module.exports = router;
