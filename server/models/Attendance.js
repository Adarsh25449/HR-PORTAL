// server/models/Attendance.js
const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to User model
    required: true,
  },
  date: {
    type: String, // Using string format (e.g., "2025-07-27") for consistency in queries
    required: true,
  },
  checkInTime: {
    type: String,
    required: true,
  },
  checkOutTime: {
    type: String,
    default: "", // Optional; can be updated later
  },
  status: {
    type: String,
    enum: ["Present", "Absent", "Half-Day", "Remote"],
    default: "Present",
  },
  markedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Attendance", attendanceSchema);

