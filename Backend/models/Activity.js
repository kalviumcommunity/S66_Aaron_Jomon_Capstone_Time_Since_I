const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    frequency: { type: String, required:true }, // Example: 'daily', 'weekly', etc.
    lastDone: { type: Date, default: null },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

const Activity = mongoose.model("Activity", ActivitySchema);
module.exports = Activity;
