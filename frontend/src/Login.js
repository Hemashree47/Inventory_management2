import React, { useState } from 'react';
import axios from 'axios';
import ProjectModal from './ProjectModal';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const LoginSignup = () => {
  const [isSignup, setIsSignup] = useState(false);
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
    if (isSignup) {
      // Signup logic
      try {
        const res = await axios.post('http://localhost:5000/api/signup', { name, username, password, confirmPassword });
        console.log(res.data);
      } catch (err) {
        console.error(err.response.data);
      }
    } else {
      // Login logic
      try {
        const res = await axios.post('http://localhost:5000/api/login', { username, password });
        console.log(res.data);
        navigate('/ProjectModal')
      } catch (err) {
        console.error(err.response.data);
      }
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={onSubmit}>
        {isSignup && (
          <>
            <h1>Signup</h1>
            <input type="text" name="name" value={name} onChange={onChange} placeholder="Name" required />
            <input type="password" name="confirmPassword" value={confirmPassword} onChange={onChange} placeholder="Confirm Password" required />
          </>
        )}
        {!isSignup && <h1>Login</h1>}
        <input type="text" name="username" value={username} onChange={onChange} placeholder="Username" required />
        <input type="password" name="password" value={password} onChange={onChange} placeholder="Password" required />
        <button type="submit">{isSignup ? 'Sign Up' : 'Login'}</button>
        {/* <button type="button" onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? 'Switch to Login' : 'Switch to Signup'}
        </button> */}
        {!isSignup && (
          <p className="signup-link">
            Don't have an account? <button type="button" onClick={() => setIsSignup(true)}>Sign Up</button>
          </p>
        )}
        {isSignup && (
          <p className="signup-link">
            Already have an account? <button type="button" onClick={() => setIsSignup(false)}>Login</button>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginSignup;
