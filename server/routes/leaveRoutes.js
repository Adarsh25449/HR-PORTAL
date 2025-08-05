// server/routes/leaveRoutes.js
const express = require("express");
const Leave = require("../models/Leave");
const router = express.Router();

// ✅ POST: Apply for leave
router.post("/apply", async (req, res) => {
  try {
    const { employeeId, fromDate, toDate, reason } = req.body;

    // ✅ Validate fields
    if (!employeeId || !fromDate || !toDate || !reason) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const leave = new Leave({
      user: employeeId,          // ⬅ matches the schema field
      fromDate,
      toDate,
      reason,
      status: "Pending"
    });

    await leave.save();
    res.status(201).json({ message: "Leave request submitted" });
  } catch (err) {
    console.error("❌ Error applying leave:", err);
    res.status(500).json({ error: "Failed to apply for leave" });
  }
});

// ✅ GET: All leave requests (admin)
router.get("/all", async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate("user", "name email")  // ⬅ updated from employeeId to user
      .sort({ createdAt: -1 });

    res.json(leaves);
  } catch (err) {
    console.error("❌ Error fetching all leaves:", err);
    res.status(500).json({ error: "Failed to fetch leave data" });
  }
});

// ✅ POST: Update leave status
router.post("/update-status", async (req, res) => {
  try {
    const { id, status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const leave = await Leave.findById(id);
    if (!leave) {
      return res.status(404).json({ error: "Leave request not found" });
    }

    leave.status = status;
    await leave.save();

    res.json({ message: `Leave status updated to ${status}` });
  } catch (err) {
    console.error("❌ Error updating leave status:", err);
    res.status(500).json({ error: "Failed to update leave status" });
  }
});

// ✅ GET: Leaves of logged-in user
router.get("/mine/:userId", async (req, res) => {
  try {
    const leaves = await Leave.find({ user: req.params.userId })  // ⬅ use `user`
      .sort({ createdAt: -1 });

    res.json(leaves);
  } catch (err) {
    console.error("❌ Error fetching user leave history:", err);
    res.status(500).json({ error: "Failed to fetch leave data" });
  }
});

module.exports = router;


