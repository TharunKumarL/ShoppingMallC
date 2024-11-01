import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/UpdateShopDetail.css'; // Import the CSS file

const UpdateShopDetail = () => {
  const { id } = useParams();
  const [shop, setShop] = useState(null);
  const [location, setLocation] = useState('');
  const [contact, setContact] = useState('');
  const [errors, setErrors] = useState({ location: '', contact: '' });
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/api/admin/shops/${id}`)
      .then(response => response.json())
      .then(data => {
        setShop(data);
        setLocation(data.location || '');
        setContact(data.contact || '');
      })
      .catch(error => console.error('Error fetching shop:', error));
  }, [id]);

  const validateForm = () => {
    const newErrors = { location: '', contact: '' };
    let formIsValid = true;

    if (!location || location.length < 3) {
      newErrors.location = 'Location must be at least 3 characters long.';
      formIsValid = false;
    }

    const phonePattern = /^\+?\d{10,15}$/;
    if (contact && !phonePattern.test(contact)) {
      newErrors.contact = 'Contact must be a valid phone number.';
      formIsValid = false;
    }

    setErrors(newErrors);
    setIsFormValid(formIsValid);
  };

  useEffect(() => {
    validateForm();
  }, [location, contact]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!isFormValid) return;

    try {
      const response = await fetch(`http://localhost:5000/api/shops/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ location, contact }),
      });

      if (response.ok) {
        alert('Shop updated successfully!');
        navigate('/admin/update-shop');
      } else {
        const errorData = await response.json();
        alert(`Update failed: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Network or server error:', error);
      alert('An error occurred during update.');
    }
  };

  if (!shop) return <div>Loading...</div>;

  return (
    <div className="update-shop-container">
      <h1>Update Shop</h1>
      <form onSubmit={handleUpdate}>
        <div>
          <label>Location:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
          {errors.location && <p className="error">{errors.location}</p>}
        </div>
        <div>
          <label>Contact:</label>
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
          {errors.contact && <p className="error">{errors.contact}</p>}
        </div>
        <button type="submit" disabled={!isFormValid}>Update Shop</button>
      </form>
    </div>
  );
};

export default UpdateShopDetail;
