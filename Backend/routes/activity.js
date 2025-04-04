const express = require("express");
const Activity = require("../models/Activity");

const router = express.Router();

// Create a new activity
router.post("/", async (req, res) => {
    try {
        const { name, description, frequency, userId } = req.body;
        const newActivity = new Activity({ name, description, frequency, userId });
        await newActivity.save();
        res.status(201).json(newActivity);
    } catch (error) {
        res.status(500).json({ message: "Error creating activity", error });
    }
});

// Get all activities
router.get("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const activities = await Activity.find({ userId });
        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({ message: "Error fetching activities", error });
    }
});


// Get a single activity by ID
router.get("/:id", async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);
        if (!activity) return res.status(404).json({ message: "Activity not found" });
        res.status(200).json(activity);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving activity", error });
    }
});

// Update an activity
router.put("/:id", async (req, res) => {
    try {
        const updatedActivity = await Activity.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedActivity) return res.status(404).json({ message: "Activity not found" });
        res.status(200).json(updatedActivity);
    } catch (error) {
        res.status(500).json({ message: "Error updating activity", error });
    }
});

// Delete an activity
router.delete("/:id", async (req, res) => {
    try {
        const deletedActivity = await Activity.findByIdAndDelete(req.params.id);
        if (!deletedActivity) return res.status(404).json({ message: "Activity not found" });
        res.status(200).json({ message: "Activity deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting activity", error });
    }
});

module.exports = router;
