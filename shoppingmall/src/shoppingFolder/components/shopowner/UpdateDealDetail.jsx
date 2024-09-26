// components/UpdateDeal.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateDealDetail = () => {
  const { id } = useParams(); // Get the deal ID from the URL
  const navigate = useNavigate();
  const [deal, setDeal] = useState({
    store: '',
    description: '',
    expiration: '',
    image: '',
  });

  useEffect(() => {
    const fetchDeal = async () => {
      try {
        const response = await fetch(`/api/deals/${id}`);
        const data = await response.json();
        setDeal(data);
      } catch (error) {
        console.error('Error fetching deal:', error);
      }
    };

    fetchDeal();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDeal((prevDeal) => ({
      ...prevDeal,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/deals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deal),
      });
      if (response.ok) {
        navigate('/shopowner/view-deals'); // Redirect after update
      } else {
        console.error('Failed to update deal');
      }
    } catch (error) {
      console.error('Error updating deal:', error);
    }
  };

  return (
    <div>
      <h1>Update Deal</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Store:</label>
          <input
            type="text"
            name="store"
            value={deal.store}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <input
            type="text"
            name="description"
            value={deal.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Expiration:</label>
          <input
            type="date"
            name="expiration"
            value={deal.expiration.split('T')[0]} // Format date for input
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Image URL:</label>
          <input
            type="text"
            name="image"
            value={deal.image}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Update Deal</button>
      </form>
    </div>
  );
};

export default UpdateDealDetail;
