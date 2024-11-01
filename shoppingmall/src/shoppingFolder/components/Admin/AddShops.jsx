import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/AddShops.css'; // Assuming you have a CSS file for styling

const AddShops = () => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [contact, setContact] = useState('');
  const [image, setImage] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};

    // Name validation
    if (name.trim().length < 3) {
      errors.name = 'Shop name must be at least 3 characters long.';
    }

    // Location validation
    if (location.trim().length < 3) {
      errors.location = 'Location must be at least 3 characters long.';
    }

    // Contact validation (10-digit number)
    const contactRegex = /^\d{10}$/;
    if (!contactRegex.test(contact)) {
      errors.contact = 'Contact number must be a valid 10-digit number.';
    }

    // Image URL validation (optional, check for URL format if provided)
    const urlRegex = /^(https?:\/\/[^\s]+)$/;
    if (image && !urlRegex.test(image)) {
      errors.image = 'Please enter a valid URL for the image.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddShop = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const token = sessionStorage.getItem('token'); // Get the JWT token

      const response = await fetch('http://localhost:5000/api/admin/shops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Pass token in headers
        },
        body: JSON.stringify({ name, location, contact, image }), // Send shop data in request body
      });

      if (response.ok) {
        const data = await response.json();
        alert('Shop added successfully!');
        navigate('/admin/view-shops'); // Redirect to view shops after adding
      } else {
        const errorData = await response.json();
        console.error('Error details:', errorData); // Log the error details for debugging
        alert(`Failed to add shop: ${errorData || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Network or server error:', error);
      alert('An error occurred while adding the shop.');
    }
  };

  return (
    <div className="add-shop-container">
      <h1>Add New Shop</h1>
      <form onSubmit={handleAddShop} className="add-shop-form">
        <div>
          <label>Shop Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {formErrors.name && <p className="error">{formErrors.name}</p>}
        </div>
        <div>
          <label>Location:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
          {formErrors.location && <p className="error">{formErrors.location}</p>}
        </div>
        <div>
          <label>Contact:</label>
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
          />
          {formErrors.contact && <p className="error">{formErrors.contact}</p>}
        </div>
        <div>
          <label>Image URL:</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
          {formErrors.image && <p className="error">{formErrors.image}</p>}
        </div>
        <button type="submit" className="add-shop-btn">Add Shop</button>
      </form>
    </div>
  );
};

export default AddShops;
