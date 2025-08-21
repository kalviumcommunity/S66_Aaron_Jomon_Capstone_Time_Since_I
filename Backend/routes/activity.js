const express = require("express");
const Activity = require("../models/Activity");
const authenticateToken = require("../middleware/auth");

const router = express.Router();

// Create a new activity
router.post("/", authenticateToken, async (req, res) => {
    try {
        const { name, description, frequency } = req.body;

        // Input validation
        if (!name || name.trim().length === 0) {
            return res.status(400).json({ message: "Activity name is required" });
        }

        if (name.trim().length > 100) {
            return res.status(400).json({ message: "Activity name must be less than 100 characters" });
        }

        const validFrequencies = ['daily', 'weekly', 'monthly'];
        if (frequency && !validFrequencies.includes(frequency)) {
            return res.status(400).json({ message: "Frequency must be daily, weekly, or monthly" });
        }

        const newActivity = new Activity({
            name: name.trim(),
            description: description ? description.trim() : '',
            frequency: frequency || 'daily',
            userId: req.user._id
        });
        await newActivity.save();
        res.status(201).json(newActivity);
    } catch (error) {
        res.status(500).json({ message: "Error creating activity", error: error.message });
    }
});

// Get all activities for authenticated user
router.get("/", authenticateToken, async (req, res) => {
    try {
        const activities = await Activity.find({ userId: req.user._id });
        res.status(200).json({ activities });
    } catch (error) {
        res.status(500).json({ message: "Error fetching activities", error: error.message });
    }
});

// Update an activity
router.put("/:id", authenticateToken, async (req, res) => {
    try {
        const updatedActivity = await Activity.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            req.body,
            { new: true }
        );
        if (!updatedActivity) return res.status(404).json({ message: "Activity not found" });
        res.status(200).json(updatedActivity);
    } catch (error) {
        res.status(500).json({ message: "Error updating activity", error: error.message });
    }
});

// Delete an activity
router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        const deletedActivity = await Activity.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });
        if (!deletedActivity) return res.status(404).json({ message: "Activity not found" });
        res.status(200).json({ message: "Activity deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting activity", error: error.message });
    }
});

// Mark activity as done (update lastDone timestamp)
router.patch("/:id/done", authenticateToken, async (req, res) => {
    try {
        const updatedActivity = await Activity.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { lastDone: new Date() },
            { new: true }
        );
        if (!updatedActivity) return res.status(404).json({ message: "Activity not found" });
        res.status(200).json(updatedActivity);
    } catch (error) {
        res.status(500).json({ message: "Error marking activity as done", error: error.message });
    }
});

module.exports = router;
