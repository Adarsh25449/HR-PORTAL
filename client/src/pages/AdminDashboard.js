import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css'; // Optional styling

const AdminDashboard = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaves = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/leave/all');
      setLeaves(res.data);
    } catch (error) {
      console.error('Error fetching leaves:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (id, decision) => {
    try {
      await axios.post('http://localhost:5000/api/leave/update-status', {
        id,
        status: decision,
      });
      alert(`Leave ${decision}`);
      fetchLeaves(); // refresh list
    } catch (error) {
      console.error('Decision error:', error.message);
      alert('Failed to update leave status');
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
      ) : (
        <div className="leave-list">
          {leaves.length === 0 ? (
            <p>No leave requests found.</p>
          ) : (
            leaves.map((leave) => (
              <div key={leave._id} className="leave-card">
                <p><strong>Employee:</strong> {leave.employeeId?.name}</p>
                <p><strong>From:</strong> {new Date(leave.fromDate).toLocaleDateString()}</p>
                <p><strong>To:</strong> {new Date(leave.toDate).toLocaleDateString()}</p>
                <p><strong>Reason:</strong> {leave.reason}</p>
                <p><strong>Status:</strong> {leave.status}</p>

                {leave.status === 'Pending' && (
                  <div className="action-buttons">
                    <button onClick={() => handleDecision(leave._id, 'Approved')}>✅ Approve</button>
                    <button onClick={() => handleDecision(leave._id, 'Rejected')}>❌ Reject</button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

