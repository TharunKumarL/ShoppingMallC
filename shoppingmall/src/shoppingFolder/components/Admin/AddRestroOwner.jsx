import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AddRestaurantOwner = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantId, setRestaurantId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/restaurants');
      if (!response.ok) {
        throw new Error('Failed to fetch restaurants');
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setRestaurants(data);
      } else {
        throw new Error('Expected an array of restaurants');
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      setError('Failed to load restaurants. Please try again later.');
    }
  };

  const validateForm = () => {
    const errors = {};

    // Restaurant selection validation
    if (!restaurantId) {
      errors.restaurantId = 'Please select a restaurant.';
    }

    // Name validation
    if (name.trim().length < 3) {
      errors.name = 'Name must be at least 3 characters long.';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.email = 'Please enter a valid email address.';
    }

    // Contact validation
    const contactRegex = /^\d{10,}$/;
    if (!contactRegex.test(contact)) {
      errors.contact = 'Contact number must be at least 10 digits.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddRestaurantOwner = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:5000/add-restaurantowners/${restaurantId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, contact }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add restaurant owner');
      }

      alert('Restaurant owner added successfully!');
      navigate('/admin/view-restaurantowners');
    } catch (error) {
      console.error('Error adding restaurant owner:', error);
      setError(error.message || 'An error occurred while adding the restaurant owner.');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="add-restaurant-owner-container">
      <h1>Add Restaurant Owner</h1>
      <form onSubmit={handleAddRestaurantOwner}>
        <div>
          <label htmlFor="restaurant-select">Select Restaurant:</label>
          <select 
            id="restaurant-select"
            value={restaurantId} 
            onChange={(e) => setRestaurantId(e.target.value)} 
            required
          >
            <option value="">Select a restaurant</option>
            {restaurants.map(restaurant => (
              <option key={restaurant._id} value={restaurant._id}>
                {restaurant.name}
              </option>
            ))}
          </select>
          {formErrors.restaurantId && <p className="error">{formErrors.restaurantId}</p>}
        </div>
        <div>
          <label htmlFor="name-input">Name:</label>
          <input
            id="name-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {formErrors.name && <p className="error">{formErrors.name}</p>}
        </div>
        <div>
          <label htmlFor="email-input">Email:</label>
          <input
            id="email-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {formErrors.email && <p className="error">{formErrors.email}</p>}
        </div>
        <div>
          <label htmlFor="contact-input">Contact:</label>
          <input
            id="contact-input"
            type="tel"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
          />
          {formErrors.contact && <p className="error">{formErrors.contact}</p>}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Restaurant Owner'}
        </button>
      </form>
    </div>
  );
};

export default AddRestaurantOwner;
