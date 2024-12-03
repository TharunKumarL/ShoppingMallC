// components/DEALS.jsx
import React, { useState, useEffect } from 'react';
import './css/Deals.css' 
const Deals = () => {
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/deals');
        const data = await response.json();
        setDeals(data);
      } catch (error) {
        console.error('Error fetching deals:', error);
      }
    };

    fetchDeals();
  }, []);

  return (
    <div className="deals-container">
      {deals.length > 0 ? (
        deals.map((deal) => (
          <div key={deal._id} className="deal-card">
            <div className="deal-details">
              <h3>{deal.shop}</h3>
              <p>{deal.description}</p>
              <p>Expires: {new Date(deal.expiration).toLocaleDateString()}</p>
            </div>
          </div>
        ))
      ) : (
        <p>No deals available at the moment.</p>
      )}
    </div>
  );
};

export default Deals;
