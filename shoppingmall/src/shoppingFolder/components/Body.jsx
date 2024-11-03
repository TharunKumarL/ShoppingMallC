import React from 'react';
import { useNavigate,Link } from 'react-router-dom';
import '../components/css/Body.css';


const Body = () => {
  const navigate = useNavigate();
  return (
    <div className="mall-body">
      {/* Navigation Links in a Row */}
      <div className="navigation-row">
        <div className="section-link home">
          <a href="/">Home</a>
        </div>
        <div className="section-link shops">
          <a href="shoplist">Shops</a>
        </div>
        <div className="section-link deals">
          <a href="deals">Deals</a>
        </div>
        <div className="section-link events">
          <a href="event">Events</a>
        </div>

      </div>

      {/* Booking section for restaurant and movie */}
      <div className="booking-section">
        <h2 className="wow-heading">Book Your Experience</h2>
        <div className="booking-options">
          <div className="restaurant-booking">
            <h3>Book a Restaurant</h3>
            <p>Find and reserve a table at your favorite restaurant in our mall.</p>
            <button 
              className="book-now-btn" 
              onClick={() => navigate('/bookrestaurant')}
            >Book Now</button>
          </div>
          <div className="movie-booking">
            <h3>Book a Movie</h3>
            <p>Watch the latest movies in our state-of-the-art cinema.</p>
            <Link 
              className="book-now-btn" 
              to = 'http://localhost:3001'
            >
              Book Now
            </Link>
          </div>
          <div className="restaurant-booking">
            <h3>Book a game</h3>
            <p>Find and enjoy your game to the fullest.</p>
            <button 
              className="book-now-btn" 
              onClick={() => navigate('/booksports')}
            >
              Book Now
            </button>
          </div>
          <div className="movie-booking">
            <h3>Book For a Events</h3>
            <p>Grab your Tickets for an event</p>
            <button className="book-now-btn">Book Now</button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Body;
