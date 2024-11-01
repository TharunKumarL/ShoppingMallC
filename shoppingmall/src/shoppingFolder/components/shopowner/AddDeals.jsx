import React, { useState } from 'react';
import '../css/AddDeals.css';

const AddDeals = () => {
  const [dealData, setDealData] = useState({
    store: '',
    description: '',
    expiration: '',
    image: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDealData({ ...dealData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    const today = new Date().toISOString().split("T")[0]; // Today's date in YYYY-MM-DD format

    if (dealData.store.trim().length < 3) {
      newErrors.store = "Store name must be at least 3 characters long.";
    }
    if (dealData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters long.";
    }
    if (dealData.expiration && dealData.expiration < today) {
      newErrors.expiration = "Expiration date must be in the future.";
    }
    if (dealData.image && !/^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(dealData.image)) {
      newErrors.image = "Please enter a valid image URL ending in .jpg, .png, etc.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return; // Stop if form validation fails

    try {
      const response = await fetch('http://localhost:5000/api/add-deal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dealData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Deal added:', result);
        setDealData({
          store: '',
          description: '',
          expiration: '',
          image: '',
        });
        setErrors({});
        alert('Deal added successfully!');
      } else {
        console.error('Failed to add deal');
        alert('Failed to add deal');
      }
    } catch (error) {
      console.error('Error during submission:', error);
      alert('An error occurred while adding the deal.');
    }
  };

  return (
    <div>
      <h1>Add Deal</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="store"
            placeholder="Store Name"
            value={dealData.store}
            onChange={handleChange}
            required
          />
          {errors.store && <p className="error">{errors.store}</p>}
        </div>
        <div>
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={dealData.description}
            onChange={handleChange}
            required
          />
          {errors.description && <p className="error">{errors.description}</p>}
        </div>
        <div>
          <input
            type="date"
            name="expiration"
            value={dealData.expiration}
            onChange={handleChange}
            required
          />
          {errors.expiration && <p className="error">{errors.expiration}</p>}
        </div>
        <div>
          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={dealData.image}
            onChange={handleChange}
          />
          {errors.image && <p className="error">{errors.image}</p>}
        </div>
        <button type="submit">Add Deal</button>
      </form>
    </div>
  );
};

export default AddDeals;
