import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/main.css'; // ✅ Make sure this is the correct path

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPassword) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/auth/signup', {
        name: trimmedName,
        email: trimmedEmail,
        password: trimmedPassword,
      });

      alert('Signup successful!');
      navigate('/');
    } catch (error) {
      console.error('Signup error:', error.response?.data || error.message);

      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Signup failed. Please try again.';

      alert(message);
    }
  };

  return (
    <div className="page-container">
      <div className="form-box">
        <h2>Signup</h2>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          autoComplete="off"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          autoComplete="off"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          autoComplete="off"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleSignup}>Register</button>

        <p style={{ marginTop: '1rem' }}>
          Already have an account? <Link to="/">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;





