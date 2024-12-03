import React from 'react';
import { Link } from 'react-router-dom';
import '../components/css/home.css';

function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to Restaurant Booking</h1>
      <p>Find the best restaurants and book your table today!</p>
      <Link to="/bookrestaurant/restaurants" className="browse-link">Browse Restaurants</Link>
    </div>
  );
}

export default Home;
