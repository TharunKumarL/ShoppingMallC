import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import './Signup.css';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isGoogleSignup, setIsGoogleSignup] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters long.';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      newErrors.password = 'Password must be at least 8 characters long, with one uppercase letter, one lowercase letter, one number, and one special character.';
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Signup response:', data);
        alert('Signup successful!');
        navigate('/login');
      } else {
        const errorData = await response.json();
        console.log('Error response:', errorData);
        alert(`Signup failed: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Network or server error:', error);
      alert('An error occurred during signup.');
    }
  };

  const handleGoogleSignup = (credentialResponse) => {
    console.log('Google credential response:', credentialResponse);

    // Pass the response to the backend
    fetch('http://localhost:5000/api/google-signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: credentialResponse.credential }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Google Signup response:', data);
        alert('Signup with Google successful!');
        navigate('/dashboard'); // Adjust this based on your app's flow
      })
      .catch((error) => {
        console.error('Google Signup error:', error);
        alert('Signup with Google failed.');
      });
  };

  return (
    <div className="Signup">
      <div className="wrapper">
        <h1>Signup</h1>

        {!isGoogleSignup ? (
          <form onSubmit={handleSignup}>
            <div className="input-group">
              <div className="input-box">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <i className="bx bxs-user"></i>
                {errors.name && <p className="error">{errors.name}</p>}
              </div>

              <div className="input-box">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <i className="bx bxs-envelope"></i>
                {errors.email && <p className="error">{errors.email}</p>}
              </div>

              <div className="input-box">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <i className="bx bxs-lock-alt"></i>
                {errors.password && <p className="error">{errors.password}</p>}
              </div>

              <div className="input-box">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <i className="bx bxs-lock-alt"></i>
                {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
              </div>
              <button type="submit" className="signupButton">Sign Up</button>
            </div>
          </form>
        ) : (
          <div className="google-signup">
            <GoogleLogin
              onSuccess={handleGoogleSignup}
              onError={() => alert('Google Signup failed')}
            />
          </div>
        )}

        <div className="toggle-auth">
          <button onClick={() => setIsGoogleSignup(!isGoogleSignup)}>
            {isGoogleSignup ? 'Sign up with Email' : 'Sign up with Google'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
