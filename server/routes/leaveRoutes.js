const express = require("express");
const router = express.Router();
const Leave = require("../models/Leave");
const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});



router.post("/apply", async (req, res) => {
  try {
    const { employeeId, fromDate, toDate, reason } = req.body;

    if (!employeeId || !fromDate || !toDate || !reason) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const leave = new Leave({
      employeeId,
      fromDate,
      toDate,
      reason,
      status: "Pending",
    });

    await leave.save();
    res.status(201).json({ message: "Leave request submitted successfully" });
  } catch (err) {
    console.error("❌ Error applying for leave:", err);
    res.status(500).json({ error: "Failed to apply for leave" });
  }
});


router.get("/all", async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate("employeeId", "name email")
      .sort({ createdAt: -1 });

    console.log("Fetched Leaves:", leaves.length);
    res.json(leaves);
  } catch (err) {
    console.error("❌ Error fetching leaves:", err);
    res.status(500).json({ error: "Failed to fetch leave data" });
  }
});


router.post("/update-status", async (req, res) => {
  try {
    const { id, status } = req.body;

    if (!id || !["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid or missing data" });
    }

    const leave = await Leave.findById(id).populate("employeeId", "name email");
    if (!leave) {
      return res.status(404).json({ error: "Leave request not found" });
    }

    
    leave.status = status;
    await leave.save();

    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: leave.employeeId.email,
      subject: `Leave ${status}`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h3>Leave ${status}</h3>
          <p>Hello <b>${leave.employeeId.name}</b>,</p>
          <p>Your leave from <b>${new Date(leave.fromDate).toDateString()}</b> 
          to <b>${new Date(leave.toDate).toDateString()}</b> has been 
          <b style="color:${status === "Approved" ? "green" : "red"}">${status}</b>.</p>
          <p><b>Reason:</b> ${leave.reason}</p>
          <p>– HR Portal</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${leave.employeeId.email}`);

    res.json({ message: `Leave ${status} successfully and email sent.` });
  } catch (err) {
    console.error("❌ Error updating leave status:", err);
    res.status(500).json({ error: "Failed to update leave status" });
  }
});




router.get("/mine/:userId", async (req, res) => {
  try {
    const leaves = await Leave.find({ employeeId: req.params.userId }).sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    console.error("❌ Error fetching user leaves:", err);
    res.status(500).json({ error: "Failed to fetch user leave data" });
  }
});

module.exports = router;











