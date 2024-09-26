import React, { useEffect, useState } from 'react';

const DealsList = () => {
  const [deals, setDeals] = useState([]);
  const [error, setError] = useState(null);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [formData, setFormData] = useState({
    store: '',
    description: '',
    expiration: '',
    image: '',
  });

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/deals');
        if (!response.ok) {
          throw new Error('Failed to fetch deals');
        }
        const data = await response.json();
        setDeals(data);
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      }
    };

    fetchDeals();
  }, []);

  const handleUpdate = (deal) => {
    setSelectedDeal(deal);
    setFormData({
      store: deal.store,
      description: deal.description,
      expiration: deal.expiration.split('T')[0], // Format for date input
      image: deal.image,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/deals/${selectedDeal._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update deal');
      }

      const updatedDeal = await response.json();
      setDeals((prevDeals) => prevDeals.map((d) => (d._id === updatedDeal._id ? updatedDeal : d)));
      setSelectedDeal(null); // Clear the selected deal
      setFormData({ store: '', description: '', expiration: '', image: '' }); // Clear form data
    } catch (error) {
      console.error('Error updating deal:', error);
      setError(error.message);
    }
  };

  return (
    <div>
      <h1>All Deals</h1>
      {error && <p className="error">{error}</p>}
      <ul>
        {deals.map((deal) => (
          <li key={deal._id}>
            <h2>{deal.store}</h2>
            <p><strong>Description:</strong> {deal.description}</p>
            <p><strong>Expiration:</strong> {new Date(deal.expiration).toLocaleDateString()}</p>
            <button onClick={() => handleUpdate(deal)}>Update Deal</button>
          </li>
        ))}
      </ul>

      {selectedDeal && (
        <div className="update-form">
          <h2>Update Deal</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Store:</label>
              <input
                type="text"
                name="store"
                value={formData.store}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Description:</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Expiration:</label>
              <input
                type="date"
                name="expiration"
                value={formData.expiration}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Image URL:</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit">Update Deal</button>
            <button type="button" onClick={() => setSelectedDeal(null)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default DealsList;
