const express = require("express");
const Activity = require("../models/Activity");

const router = express.Router();

// Get all activities
router.get("/", async (req, res) => {
    try {
        const activities = await Activity.find();
        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving activities", error });
    }
});

module.exports = router;
