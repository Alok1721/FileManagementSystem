import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { loginUser, registerUser } from '../services/loginRegister'; 
import '../styles/login.css'; 

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!email || !password) {
      setError('Both fields are required');
      return;
    }

    try {
      await loginUser(email, password);
      setSuccess(true);
      navigate('/'); 
    } catch (err) {
      setError(`Error: ${err.message}`);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await registerUser(name, email, password);
      setSuccess(true);
      navigate('/'); 
    } catch (err) {
      setError(`Error: ${err.message}`);
    }
  };

  return (
    <div className="container">
      <div className="auth-form">
        <h2>{isLogin ? 'Login' : 'Signup'}</h2>
        <form onSubmit={isLogin ? handleLogin : handleSignup}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          )}
          <button type="submit">{isLogin ? 'Login' : 'Signup'}</button>
        </form>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{isLogin ? 'Login successful!' : 'Signup successful!'}</p>}

        <p className="switch-form-btn" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Don’t have an account? Signup' : 'Already have an account? Login'}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
