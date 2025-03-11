import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [image, setImage] = useState(null); // New state for image
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters long.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      newErrors.password =
        'Password must be at least 8 characters long, with one uppercase letter, one lowercase letter, one number, and one special character.';
    }

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

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    if (image) {
      formData.append('image', image); // Append the image file
    }

    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        body: formData, // Use FormData for file uploads
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

  return (
    <div className="Signup">
      <div className="wrapper">
        <h1>Signup</h1>
        <form onSubmit={handleSignup} encType="multipart/form-data">
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
              {errors.confirmPassword && (
                <p className="error">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Image Upload Field */}
            <div className="input-box">
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                required
              />
            </div>

            <button type="submit" className="signupButton">
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
