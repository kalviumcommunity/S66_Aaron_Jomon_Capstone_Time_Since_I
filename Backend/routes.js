const express = require("express");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const router = express.Router();

const User = mongoose.model("User", new mongoose.Schema({
    username: {type: String, required : true},
    email: { type: String, unique: true },
    password: {type: String, required: true}
}));

// Signup Route
router.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

        res.status(201).json({ message: "User created successfully!" });
    });

    router.get("/users", async (req, res) => {
        try {
            const users = await User.find().select("-password");
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving users", error });
        }
    });

    router.put("/users/:id", async (req, res) => {
        try {
            const { id } = req.params;
            const { username, email } = req.body;
    
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
    
            // Update fields if provided
            if (username) user.username = username;
            if (email) user.email = email;
    
            await user.save();
            res.status(200).json({ message: "User updated successfully", user });
        } catch (error) {
            console.error("Update Error:", error);
            res.status(500).json({ message: "Error updating user", error });
        }
    });

module.exports = router;