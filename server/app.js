require("dotenv").config();  // Must be at the top!
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/User"); // 👈 Import User model to check/create admin

// Import route files
const authRoutes = require("./routes/authRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const leaveRoutes = require("./routes/leaveRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
console.log("Mongo URI:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log("✅ MongoDB connected");

  // ✅ Create admin if not exists
  const adminEmail = "admin@example.com";
  const existingAdmin = await User.findOne({ email: adminEmail });

  if (!existingAdmin) {
    const adminUser = new User({
      name: "Admin",
      email: adminEmail,
      password: "securepass", // You may hash this if you use bcrypt
      role: "admin"
    });

    await adminUser.save();
    console.log("✅ Default admin created: admin@example.com / securepass");
  } else {
    console.log("✅ Admin already exists");
  }

})
.catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});

// Route Handlers
app.use("/api/auth", authRoutes);             // ✅ /api/auth/signup and /api/auth/login
app.use("/api/attendance", attendanceRoutes); // ✅ /api/attendance/checkin
app.use("/api/leave", leaveRoutes);           // ✅ /api/leave/apply

// Server Listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));






