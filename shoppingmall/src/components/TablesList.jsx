import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import '../components/css/tablelist.css'; // Import the CSS file for TableList component

function TableList() {
  const { hotelId } = useParams();
  const [tables, setTables] = useState([]);
  const [hotelDetails, setHotelDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchHotelDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/hotels/${hotelId}`);
      if (!response.ok) throw new Error('Failed to fetch hotel details.');
      const data = await response.json();
      setHotelDetails(data);
      setTables(data.tables || []);
    } catch (error) {
      console.error('Error fetching hotel details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotelDetails();
  }, [hotelId]);

  const handleTableClick = (table) => {
    if (table.isAvailable) {
      navigate(`/bookrestaurant/restaurants/${hotelId}/tables/${table._id}`);
    }
  };

  if (loading) {
    return <div className="table-container">Loading details...</div>;
  }

  if (!hotelDetails) {
    return <div className="table-container">Error loading hotel details.</div>;
  }

  return (
    <div className="table-container">
      {/* Hotel details */}
      <h1 className="header">{hotelDetails.name}</h1>
      <p>{hotelDetails.description}</p>
      <p><strong>Cuisine:</strong> {hotelDetails.cuisine}</p>
      <p><strong>Dietary Options:</strong> {hotelDetails.dietary}</p>
      <p><strong>Seating Type:</strong> {hotelDetails.seating}</p>
      {hotelDetails.menuImage && (
        <img
          src={hotelDetails.menuImage}
          alt={`${hotelDetails.name} menu`}
          className="menu-image"
        />
      )}

      {/* Tables information */}
      {tables.length > 0 ? (
        <div className="table-card-container">
          {tables.map((table, index) => (
            <div
              key={table._id}
              className={`table-card ${table.isAvailable ? 'available-card' : 'occupied-card'}`}
              onClick={() => handleTableClick(table)}
            >
              <div className="table-info">
                <strong>Table {index + 1}</strong>
              </div>
              <div className="table-info">Seats: {table.capacity}</div>
              <div className="table-info">
                <span className={`table-status ${table.isAvailable ? 'status-available' : 'status-occupied'}`}>
                  {table.isAvailable ? 'Available' : 'Occupied'}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-tables">No tables available for this hotel.</div>
      )}

      {/* Back to Restaurants */}
      <Link to="/bookrestaurant/restaurants" className="back-link">
        Back to Restaurants
      </Link>
    </div>
  );
}

export default TableList;