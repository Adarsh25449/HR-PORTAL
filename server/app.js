require("dotenv").config();  
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/User"); 


const authRoutes = require("./routes/authRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const leaveRoutes = require("./routes/leaveRoutes");

const app = express();


app.use(cors());
app.use(express.json());


console.log("Mongo URI:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log("✅ MongoDB connected");

  
  const adminEmail = "admin@example.com";
  const existingAdmin = await User.findOne({ email: adminEmail });

  if (!existingAdmin) {
    const adminUser = new User({
      name: "Admin",
      email: adminEmail,
      password: "securepass", 
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


app.use("/api/auth", authRoutes);             
app.use("/api/attendance", attendanceRoutes); 
app.use("/api/leave", leaveRoutes);           
app.use("/api/leave", require("./routes/leaveRoutes"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));






