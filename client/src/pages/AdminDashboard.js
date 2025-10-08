
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const fetchLeaves = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/leave/all");
      console.log("Fetched leaves:", res.data);
      setLeaves(res.data || []);
    } catch (error) {
      console.error("❌ Error fetching leaves:", error.response?.data || error.message);
      alert("Failed to load leave requests.");
    } finally {
      setLoading(false);
    }
  };

  
  const handleDecision = async (id, decision) => {
    try {
      const res = await axios.post("http://localhost:5000/api/leave/update-status", {
  id,
  status: decision,
});

      alert(res.data.message);
      fetchLeaves(); 
    } catch (error) {
      console.error("❌ Decision error:", error.response?.data || error.message);
      alert(error.response?.data?.error || "Failed to update leave status");
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      {loading ? (
        <p>Loading leave requests...</p>
      ) : leaves.length === 0 ? (
        <p>No leave requests found.</p>
      ) : (
        <div className="leave-list">
          {leaves.map((leave) => (
            <div key={leave._id} className="leave-card">
              <p><strong>Employee:</strong> {leave.employeeId?.name || "N/A"}</p>
              <p><strong>Email:</strong> {leave.employeeId?.email || "N/A"}</p>
              <p><strong>From:</strong> {new Date(leave.fromDate || leave.from).toLocaleDateString()}</p>
              <p><strong>To:</strong> {new Date(leave.toDate || leave.to).toLocaleDateString()}</p>
              <p><strong>Reason:</strong> {leave.reason}</p>
              <p><strong>Status:</strong> 
                <span style={{
                  color: leave.status === "Approved" ? "green" :
                         leave.status === "Rejected" ? "red" : "orange",
                  fontWeight: "bold",
                  marginLeft: "5px"
                }}>
                  {leave.status}
                </span>
              </p>

              {leave.status === "Pending" && (
                <div className="action-buttons">
                  <button onClick={() => handleDecision(leave._id, "Approved")}>
                    ✅ Approve
                  </button>
                  <button onClick={() => handleDecision(leave._id, "Rejected")}>
                    ❌ Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;





