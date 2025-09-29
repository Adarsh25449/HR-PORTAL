const express = require("express");
const Leave = require("../models/Leave");
const router = express.Router();


router.get("/leaves", async (req, res) => {
  try {
    const leaves = await Leave.find().populate('userId', 'name email');
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch leaves" });
  }
});


router.post("/leave/:id/decision", async (req, res) => {
  const { status, adminResponse } = req.body;
  try {
    const updated = await Leave.findByIdAndUpdate(
      req.params.id,
      { status, adminResponse },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update leave status" });
  }
});
