import React from 'react';
import { Link } from 'react-router-dom';
import '../components/css/home.css';

function Home() {
  return (
    <div className="RS-home-container">
      <h1 className="RS-h1">Welcome to Restaurant Booking</h1>
      <p className="RS-p">Find the best restaurants and book your table today!</p>
      <Link to="/bookrestaurant/restaurants" className="RS-browse-link">Browse Restaurants</Link>
    </div>
  );
}

export default Home;
