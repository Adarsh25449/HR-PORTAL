import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './LeaveStatus.css';

const LeaveStatus = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user?._id) {
      alert("User not logged in");
      setLoading(false);
      return;
    }

    const fetchLeaves = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/leave/mine/${user._id}`);
        setLeaves(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (err) {
        console.error('❌ Error fetching leaves:', err);
        setError('Failed to load leave history.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();
  }, [user]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (leaves.length === 0) return <p>No leave requests found.</p>;

  return (
    <div className="leave-status-container">
      <h2>Your Leave Applications</h2>
      <table className="leave-status-table">
        <thead>
          <tr>
            <th>From</th>
            <th>To</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Updated At</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave) => (
            <tr key={leave._id}>
              <td>{new Date(leave.fromDate).toDateString()}</td>
              <td>{new Date(leave.toDate).toDateString()}</td>
              <td>{leave.reason}</td>
              <td>
                <span className={`status ${leave.status ? leave.status.toLowerCase() : ''}`}>
                  {leave.status || '-'}
                </span>
              </td>
              <td>{leave.updatedAt ? new Date(leave.updatedAt).toLocaleString() : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveStatus;



