const express = require("express");
const Activity = require("../models/Activity");
const authenticateToken = require("../middleware/auth");

const router = express.Router();

// Create a new activity
router.post("/", authenticateToken, async (req, res) => {
    try {
        const { name, description, frequencyValue, frequencyUnit, frequency } = req.body;

        // Input validation
        if (!name || name.trim().length === 0) {
            return res.status(400).json({ message: "Activity name is required" });
        }

        if (name.trim().length > 100) {
            return res.status(400).json({ message: "Activity name must be less than 100 characters" });
        }

        // Validate new frequency format
        if (frequencyValue !== undefined && frequencyUnit !== undefined) {
            const validUnits = ['hours', 'days', 'weeks', 'months', 'years'];
            if (!validUnits.includes(frequencyUnit)) {
                return res.status(400).json({ message: "Frequency unit must be hours, days, weeks, months, or years" });
            }
            if (frequencyValue < 1) {
                return res.status(400).json({ message: "Frequency value must be at least 1" });
            }

            // Validate maximum values based on unit
            const maxValues = {
                'hours': 8760,
                'days': 366,
                'weeks': 52,
                'months': 12,
                'years': 1
            };

            const maxValue = maxValues[frequencyUnit];
            if (maxValue && frequencyValue > maxValue) {
                return res.status(400).json({
                    message: `Maximum ${maxValue} ${frequencyUnit} allowed`
                });
            }
        }

        // Support both old and new frequency formats
        const activityData = {
            name: name.trim(),
            description: description ? description.trim() : '',
            userId: req.user._id
        };

        if (frequencyValue !== undefined && frequencyUnit !== undefined) {
            activityData.frequencyValue = frequencyValue;
            activityData.frequencyUnit = frequencyUnit;
            activityData.frequency = `${frequencyValue}_${frequencyUnit}`;
        } else {
            // Fallback to old format
            const validFrequencies = ['daily', 'weekly', 'monthly'];
            if (frequency && !validFrequencies.includes(frequency)) {
                return res.status(400).json({ message: "Frequency must be daily, weekly, or monthly" });
            }
            activityData.frequency = frequency || 'daily';
            activityData.frequencyValue = 1;
            activityData.frequencyUnit = frequency === 'weekly' ? 'weeks' : frequency === 'monthly' ? 'months' : 'days';
        }

        const newActivity = new Activity(activityData);
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

// Get a single activity by ID
router.get("/:id", authenticateToken, async (req, res) => {
    try {
        const activity = await Activity.findOne({
            _id: req.params.id,
            userId: req.user._id
        });
        if (!activity) {
            return res.status(404).json({ message: "Activity not found" });
        }
        res.status(200).json({ activity });
    } catch (error) {
        res.status(500).json({ message: "Error fetching activity", error: error.message });
    }
});

// Update an activity
router.put("/:id", authenticateToken, async (req, res) => {
    try {
        const { name, description, frequencyValue, frequencyUnit, frequency } = req.body;

        // Input validation
        if (name && name.trim().length > 100) {
            return res.status(400).json({ message: "Activity name must be less than 100 characters" });
        }

        // Validate new frequency format if provided
        if (frequencyValue !== undefined && frequencyUnit !== undefined) {
            const validUnits = ['hours', 'days', 'weeks', 'months', 'years'];
            if (!validUnits.includes(frequencyUnit)) {
                return res.status(400).json({ message: "Frequency unit must be hours, days, weeks, months, or years" });
            }
            if (frequencyValue < 1) {
                return res.status(400).json({ message: "Frequency value must be at least 1" });
            }

            // Validate maximum values based on unit
            const maxValues = {
                'hours': 8760,
                'days': 366,
                'weeks': 52,
                'months': 12,
                'years': 1
            };

            const maxValue = maxValues[frequencyUnit];
            if (maxValue && frequencyValue > maxValue) {
                return res.status(400).json({
                    message: `Maximum ${maxValue} ${frequencyUnit} allowed`
                });
            }
        }

        // Prepare update data
        const updateData = {};
        if (name !== undefined) updateData.name = name.trim();
        if (description !== undefined) updateData.description = description.trim();

        if (frequencyValue !== undefined && frequencyUnit !== undefined) {
            updateData.frequencyValue = frequencyValue;
            updateData.frequencyUnit = frequencyUnit;
            updateData.frequency = `${frequencyValue}_${frequencyUnit}`;
        } else if (frequency !== undefined) {
            // Handle old frequency format
            updateData.frequency = frequency;
            updateData.frequencyValue = 1;
            updateData.frequencyUnit = frequency === 'weekly' ? 'weeks' : frequency === 'monthly' ? 'months' : 'days';
        }

        const updatedActivity = await Activity.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            updateData,
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
