import React, { useState } from 'react';
import axios from 'axios';
import './LeaveForm.css'; // Your custom styling

const LeaveForm = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = async () => {
    if (!fromDate || !toDate || !reason) {
      alert('⚠️ Please fill in all fields');
      return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user._id) {
      alert('⚠️ User not logged in');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/leave/apply', {
        employeeId: user._id,
        fromDate,
        toDate,
        reason,
      });

      alert('✅ Leave applied successfully!');
      setFromDate('');
      setToDate('');
      setReason('');
    } catch (error) {
      console.error('❌ Error applying leave:', error.response?.data || error.message);

      const msg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        '❌ Failed to apply for leave. Try again later.';
      alert(msg);
    }
  };

  return (
    <div className="form-container">
      <h2>📝 Apply Leave</h2>

      <input
        type="date"
        value={fromDate}
        onChange={(e) => setFromDate(e.target.value)}
        className="form-input"
        placeholder="From Date"
      /><br />

      <input
        type="date"
        value={toDate}
        onChange={(e) => setToDate(e.target.value)}
        className="form-input"
        placeholder="To Date"
      /><br />

      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className="form-textarea"
        placeholder="Reason for leave"
        rows={4}
      /><br />

      <button onClick={handleSubmit} className="form-button">
        Submit
      </button>
    </div>
  );
};

export default LeaveForm;



