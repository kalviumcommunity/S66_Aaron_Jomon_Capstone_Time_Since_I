const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: '' },
    frequencyValue: { type: Number, required: true, default: 1 },
    frequencyUnit: { type: String, required: true, default: 'days', enum: ['hours', 'days', 'weeks', 'months', 'years'] },
    // Keep old frequency field for backward compatibility
    frequency: { type: String, default: 'daily' },
    lastDone: { type: Date, default: null },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, {
    timestamps: true
});

const Activity = mongoose.model("Activity", ActivitySchema);
module.exports = Activity;
