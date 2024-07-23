import React, { useState } from 'react';
import axios from 'axios';
import './Signup.css';  // Import the CSS file

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const { name, username, password, confirmPassword } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/signup', formData);
      console.log(res.data);
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <form className="signup-form" onSubmit={onSubmit}>
      <h1>Signup</h1>
      <input type="text" name="name" value={name} onChange={onChange} placeholder="Name" required />
      <input type="text" name="username" value={username} onChange={onChange} placeholder="Username" required />
      <input type="password" name="password" value={password} onChange={onChange} placeholder="Password" required />
      <input type="password" name="confirmPassword" value={confirmPassword} onChange={onChange} placeholder="Confirm Password" required />
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default Signup;
