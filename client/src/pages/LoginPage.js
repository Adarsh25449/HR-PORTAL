import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/main.css'; 

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      alert('⚠️ Please enter both email and password');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email: trimmedEmail,
        password: trimmedPassword,
      });

      const user = res.data;

      
      localStorage.setItem('user', JSON.stringify(user));

      alert('✅ Login successful!');

      
      if (user.role === 'admin') {
        navigate('/admin'); 
      } else {
        navigate('/dashboard'); 
      }

    } catch (error) {
      console.error('❌ Login failed:', error.response?.data || error.message);

      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        '❌ Login failed. Please check your credentials.';
      alert(message);
    }
  };

  return (
    <div className="page-container">
      <div className="form-box">
        <h2>Login to HR Portal</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>

        <p>
          Don't have an account?{' '}
          <Link to="/signup">Sign up here</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;




