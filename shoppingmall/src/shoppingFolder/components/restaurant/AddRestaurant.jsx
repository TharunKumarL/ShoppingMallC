import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddRestaurants = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [dietary, setDietary] = useState('');
  const [seating, setSeating] = useState('');
  const [image, setImage] = useState('');
  const [location, setLocation] = useState('');
  const [contact, setContact] = useState('');
  const [workingHours, setWorkingHours] = useState({
    monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};

    if (name.trim().length < 3) errors.name = 'Restaurant name must be at least 3 characters long.';
    if (category.trim().length < 3) errors.category = 'Category must be at least 3 characters long.';
    if (cuisine.trim().length < 3) errors.cuisine = 'Cuisine must be at least 3 characters long.';
    if (dietary.trim().length < 3) errors.dietary = 'Dietary option must be at least 3 characters long.';
    if (seating.trim().length < 3) errors.seating = 'Seating option must be at least 3 characters long.';
    if (location.trim().length < 3) errors.location = 'Location must be at least 3 characters long.';
    if (!/^\d{10}$/.test(contact)) errors.contact = 'Contact number must be a valid 10-digit number.';
    if (image && !/^(https?:\/\/[^\s]+)$/.test(image)) errors.image = 'Please enter a valid image URL.';
    
    Object.keys(workingHours).forEach(day => {
      if (workingHours[day].trim().length < 3) {
        errors[day] = `${day.charAt(0).toUpperCase() + day.slice(1)} hours must be at least 3 characters long.`;
      }
    });
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/restaurants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name, category, cuisine, dietary, seating, image, location, contact, workingHours })
      });

      if (response.ok) {
        alert('Restaurant added successfully!');
        navigate('/admin/view-restaurants');
      } else {
        const errorData = await response.json();
        alert(`Failed to add restaurant: ${errorData || 'Unknown error'}`);
      }
    } catch (error) {
      alert('An error occurred while adding the restaurant.');
    }
  };

  return (
    <div className="add-restaurant-container">
      <h1>Add New Restaurant</h1>
      <form onSubmit={handleAddRestaurant} className="add-restaurant-form">
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        {formErrors.name && <p className="error">{formErrors.name}</p>}
        <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} required />
        {formErrors.category && <p className="error">{formErrors.category}</p>}
        <input type="text" placeholder="Cuisine" value={cuisine} onChange={(e) => setCuisine(e.target.value)} required />
        {formErrors.cuisine && <p className="error">{formErrors.cuisine}</p>}
        <input type="text" placeholder="Dietary Options" value={dietary} onChange={(e) => setDietary(e.target.value)} required />
        {formErrors.dietary && <p className="error">{formErrors.dietary}</p>}
        <input type="text" placeholder="Seating" value={seating} onChange={(e) => setSeating(e.target.value)} required />
        {formErrors.seating && <p className="error">{formErrors.seating}</p>}
        <input type="text" placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} />
        {formErrors.image && <p className="error">{formErrors.image}</p>}
        <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} required />
        {formErrors.location && <p className="error">{formErrors.location}</p>}
        <input type="text" placeholder="Contact" value={contact} onChange={(e) => setContact(e.target.value)} required />
        {formErrors.contact && <p className="error">{formErrors.contact}</p>}

        {Object.keys(workingHours).map((day) => (
          <div key={day}>
            <label>{day.charAt(0).toUpperCase() + day.slice(1)} Hours:</label>
            <input type="text" value={workingHours[day]} onChange={(e) => setWorkingHours({ ...workingHours, [day]: e.target.value })} required />
            {formErrors[day] && <p className="error">{formErrors[day]}</p>}
          </div>
        ))}

        <button type="submit" className="add-restaurant-btn">Add Restaurant</button>
      </form>
    </div>
  );
};

export default AddRestaurants;
