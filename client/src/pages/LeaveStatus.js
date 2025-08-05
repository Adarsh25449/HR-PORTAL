import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './LeaveStatus.css'; // Optional: style this file for professional look

const LeaveStatus = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/leave/mine/${user._id}`);
        setLeaves(res.data);
      } catch (err) {
        console.error('Error fetching leaves:', err);
        alert('Failed to load leave history.');
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchLeaves();
    }
  }, [user]);

  return (
    <div className="leave-status-container">
      <h2>Your Leave Applications</h2>

      {loading ? (
        <p>Loading...</p>
      ) : leaves.length === 0 ? (
        <p>No leave requests found.</p>
      ) : (
        <table className="leave-status-table">
          <thead>
            <tr>
              <th>From</th>
              <th>To</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave) => (
              <tr key={leave._id}>
                <td>{leave.from}</td>
                <td>{leave.to}</td>
                <td>{leave.reason}</td>
                <td>
                  <span className={`status ${leave.status.toLowerCase()}`}>
                    {leave.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LeaveStatus;
