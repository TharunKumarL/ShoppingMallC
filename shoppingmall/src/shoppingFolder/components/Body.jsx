import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaMoon, FaSun } from 'react-icons/fa'; // Import icons from React Icons
import '../components/css/Body.css';

const Body = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  // Toggle dark/light mode
  const toggleMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Apply dark mode to body element
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);
  const handleBookNowClick = () => {
    window.open("http://localhost:3001", "_blank"); // Open the link in a new tab
  };
  return (
    <div className={`mall-body ${isDarkMode ? 'dark' : 'light'}`}>
      {/* Dark/Light Mode Toggle Button with Icons */}
      <button className={`mode-toggle ${isDarkMode ? 'dark' : 'light'}`} onClick={toggleMode}>
        {isDarkMode ? <FaSun /> : <FaMoon />} {/* Show sun or moon icon */}
      </button>

      {/* Navigation Links in a Row */}
      <div className={`navigation-row ${isDarkMode ? 'dark' : 'light'}`}>
        <div className={`section-link home ${isDarkMode ? 'dark' : 'light'}`}>
          <a href="/">Home</a>
        </div>
        <div className={`section-link shops ${isDarkMode ? 'dark' : 'light'}`}>
          <a href="shoplist">Shops</a>
        </div>
        <div className={`section-link deals ${isDarkMode ? 'dark' : 'light'}`}>
          <a href="deals">Deals</a>
        </div>
        <div className={`section-link events ${isDarkMode ? 'dark' : 'light'}`}>
          <a href="event">Events</a>
        </div>
      </div>

      {/* Booking section for restaurant and movie */}
      <div className={`booking-section ${isDarkMode ? 'dark' : 'light'}`}>
        <h2 className={`wow-heading ${isDarkMode ? 'dark' : 'light'}`}>Book Your Experience</h2>
        <div className={`booking-options ${isDarkMode ? 'dark' : 'light'}`}>
          <div className={`restaurant-booking ${isDarkMode ? 'dark' : 'light'}`}>
            <h3>Book a Restaurant</h3>
            <p>Find and reserve a table at your favorite restaurant.</p>
            <button 
              className={`book-now-btn ${isDarkMode ? 'dark' : 'light'}`} 
              onClick={() => navigate('/bookrestaurant')}
            >
              Book Now
            </button>
          </div>
          <div className={`movie-booking ${isDarkMode ? 'dark' : 'light'}`}>
      <h3>Book a Movie</h3>
      <p>Watch the latest movies in our state-of-the-art cinema.</p>
      <button
        className={`book-now-btn ${isDarkMode ? 'dark' : 'light'}`}
        onClick={handleBookNowClick}
      >
        Book Now
      </button>
    </div>

          <div className={`restaurant-booking ${isDarkMode ? 'dark' : 'light'}`}>
            <h3>Book a Game</h3>
            <p>Find and enjoy your game to the fullest.</p>
            <button 
              className={`book-now-btn ${isDarkMode ? 'dark' : 'light'}`} 
              onClick={() => navigate('/booksports')}
            >
              Book Now
            </button>
          </div>
          <div className={`movie-booking ${isDarkMode ? 'dark' : 'light'}`}>
            <h3>Book For an Event</h3>
            <p>Grab your Tickets for an event</p>
            <button className={`book-now-btn ${isDarkMode ? 'dark' : 'light'}`}>Book Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;
