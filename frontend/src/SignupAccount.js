import React, { useState } from 'react';
import axios from 'axios';
import './Signup.css'; // You can create a separate CSS file for Signup
import { useNavigate } from 'react-router-dom';


const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const { name, username, password, confirmPassword } = formData;

  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      console.error('Passwords do not match');
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/api/signup', { name, username, password });
      console.log(res.data);
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={onSubmit}>
        <h1>Signup</h1>
        <input type="text" name="name" value={name} onChange={onChange} placeholder="Name" required />
        <input type="text" name="username" value={username} onChange={onChange} placeholder="Username" required />
        <input type="password" name="password" value={password} onChange={onChange} placeholder="Password" required />
        <input type="password" name="confirmPassword" value={confirmPassword} onChange={onChange} placeholder="Confirm Password" required />
        <button type="submit">Sign Up</button>
        <p className="signup-link">
            Already have an account? <button type="button" onClick={() => navigate('/Login')}>Sign Up</button>
          </p>
      </form>
    </div>
  );
};

export default Signup;
