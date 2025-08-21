const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: '' },
    frequency: { type: String, required: true, default: 'daily' }, // Example: 'daily', 'weekly', etc.
    lastDone: { type: Date, default: null },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, {
    timestamps: true
});

const Activity = mongoose.model("Activity", ActivitySchema);
module.exports = Activity;
