import React, { useState } from 'react';
import axios from 'axios';

const Attendance = () => {
  const [mode, setMode] = useState('checkin');
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user._id) {
      alert('User not logged in');
      return;
    }

    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toLocaleTimeString();

    const url = `http://localhost:5000/api/attendance/${mode}`;
    const payload = {
      employeeId: user._id,
      date,
      ...(mode === 'checkin' ? { checkInTime: time } : { checkOutTime: time }),
    };

    try {
      setLoading(true);
      await axios.post(url, payload);
      alert(`${mode === 'checkin' ? 'Check-in' : 'Check-out'} successful!`);
    } catch (err) {
      alert('Failed to mark attendance');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h2>Mark Attendance</h2>
      <div style={{ marginBottom: '1rem' }}>
        <button
          style={{ ...btnStyle, backgroundColor: mode === 'checkin' ? '#28a745' : '#ccc' }}
          onClick={() => setMode('checkin')}
        >
          ✅ Check-In
        </button>
        &nbsp;
        <button
          style={{ ...btnStyle, backgroundColor: mode === 'checkout' ? '#dc3545' : '#ccc' }}
          onClick={() => setMode('checkout')}
        >
          🔴 Check-Out
        </button>
      </div>
      <button style={submitStyle} onClick={handleAction} disabled={loading}>
        {loading ? 'Submitting...' : `Submit ${mode}`}
      </button>
    </div>
  );
};

const btnStyle = {
  padding: '0.6rem 1.2rem',
  border: 'none',
  color: 'white',
  fontWeight: 'bold',
  cursor: 'pointer',
  borderRadius: '5px',
};

const submitStyle = {
  ...btnStyle,
  backgroundColor: '#007bff',
};

export default Attendance;
