import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters long.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      newErrors.password =
        "Password must be at least 8 characters long, with one uppercase letter, one lowercase letter, one number, and one special character.";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (image) {
      const validImageTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!validImageTypes.includes(image.type)) {
        newErrors.image = "Only JPG, JPEG, and PNG files are allowed.";
      }
      if (image.size > 5 * 1024 * 1024) {
        newErrors.image = "Image size should be less than 5MB.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        alert("Signup successful!");
        navigate("/login");
      } else {
        const errorData = await response.json();
        alert(`Signup failed: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      alert("An error occurred during signup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Signup">
      <div className="wrapper">
        <h1>Signup</h1>
        <form onSubmit={handleSignup} encType="multipart/form-data">
          <div className="input-group">
            <div className="input-box">
              <label>Name</label>
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
              <label>Email</label>
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
              <label>Password</label>
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
              <label>Confirm Password</label>
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

            <div className="input-box">
              <label>Profile Image (Optional)</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
              {errors.image && <p className="error">{errors.image}</p>}
            </div>

            <button type="submit" className="signupButton" disabled={loading}>
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
