import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/main.css'; // ✅ Ensure this path is correct

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="page-container">
      <div className="form-box">
        <h2>Welcome, {user?.name || 'Employee'}!</h2>

        <div style={{ marginTop: '2rem' }}>
          <Link to="/leave" className="btn">
            📄 Apply Leave
          </Link>
          <br /><br />
          <Link to="/attendance" className="btn">
            🕒 Mark Attendance
          </Link>
          <br /><br />
          <button onClick={handleLogout} className="btn btn-danger">
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


