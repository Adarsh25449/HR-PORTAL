
import React, { useState } from "react";
import axios from "axios";
import "./LeaveForm.css";

const LeaveForm = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e && e.preventDefault();

    if (!fromDate || !toDate || !reason.trim()) {
      alert("⚠️ Please fill in all fields");
      return;
    }

    if (new Date(fromDate) > new Date(toDate)) {
      alert("⚠️ 'From' date cannot be after 'To' date");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user._id) {
      alert("Please login to apply for leave");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        employeeId: user._id,
        fromDate,
        toDate,
        reason: reason.trim(),
      };

      const res = await axios.post("http://localhost:5000/api/leave/apply", payload, {
        headers: { "Content-Type": "application/json" },
      });

      alert(res.data?.message || "Leave applied");
      setFromDate("");
      setToDate("");
      setReason("");
    } catch (err) {
      
      const msg = err?.response?.data?.error || err?.response?.data?.message || err.message;
      console.error("Error applying leave:", err);
      alert(`❌ Failed to apply leave: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Apply Leave</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label>From</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            required
          />
        </div>

        <div className="form-row">
          <label>To</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            required
          />
        </div>

        <div className="form-row">
          <label>Reason</label>
          <textarea
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="form-button" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default LeaveForm;








