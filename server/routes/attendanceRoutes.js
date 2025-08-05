const express = require("express");
const Attendance = require("../models/Attendance");
const router = express.Router();

router.post("/checkin", async (req, res) => {
  const record = new Attendance(req.body);
  await record.save();
  res.send({ message: "Checked in" });
});

router.post("/checkout", async (req, res) => {
  const record = await Attendance.findOne({ employeeId: req.body.employeeId, date: req.body.date });
  if (record) {
    record.checkOutTime = req.body.checkOutTime;
    await record.save();
    res.send({ message: "Checked out" });
  } else {
    res.status(404).send({ error: "Attendance record not found" });
  }
});

router.get("/:employeeId", async (req, res) => {
  const records = await Attendance.find({ employeeId: req.params.employeeId });
  res.send(records);
});

module.exports = router;
