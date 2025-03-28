import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import InfiniteScroll from "./InfiniteScroller";
import "./css/restaurantlist.css";
import { FaClock, FaUsers, FaUtensils, FaChair } from 'react-icons/fa';

function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [selectedDietary, setSelectedDietary] = useState("");
  const [selectedSeating, setSelectedSeating] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tableAvailability, setTableAvailability] = useState({});

  const offers = [
    "50% off on your first order!",
    "Buy 1 Get 1 Free on selected items!",
    "Free delivery for orders above ₹500/-!",
    "20% cashback on prepaid orders!",
  ];

  // const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch restaurants from the backend on component mount
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/hotels");
        if (!response.ok) {
          throw new Error(`Failed to fetch restaurants: ${response.status}`);
        }
        const data = await response.json();
        setRestaurants(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        setError('Failed to load restaurants. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  useEffect(() => {
    const fetchTableAvailability = async () => {
      try {
        const availability = {};
        for (const restaurant of restaurants) {
          const totalTables = restaurant.tables.length;
          const availableTables = restaurant.tables.filter(table => table.isAvailable).length;
          availability[restaurant._id] = {
            total: totalTables,
            available: availableTables
          };
        }
        setTableAvailability(availability);
      } catch (error) {
        console.error("Error fetching table availability:", error);
      }
    };

    if (restaurants.length > 0) {
      fetchTableAvailability();
    }
  }, [restaurants]);

  const filteredRestaurants = restaurants.filter((restaurant) => {
    return (
      (selectedCategory ? restaurant.category === selectedCategory : true) &&
      (selectedCuisine ? restaurant.cuisine === selectedCuisine : true) &&
      (selectedDietary ? restaurant.dietary === selectedDietary : true) &&
      (selectedSeating ? restaurant.seating === selectedSeating : true)
    );
  });

  const handleClearFilters = () => {
    setSelectedCategory("");
    setSelectedCuisine("");
    setSelectedDietary("");
    setSelectedSeating("");
  };

  if (loading) {
    return (
      <div className="RS-loading">
        <div className="RS-loading-spinner"></div>
        <p>Loading restaurants...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="RS-error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="RS-container">
      <div className="RS-offers-section">
        <h1 className="RS-section-title">Today's Special Offers</h1>
        <InfiniteScroll offers={offers} />
      </div>

      <div className="RS-main-content">
        <h1 className="RS-header">Discover Restaurants</h1>

        <div className="RS-filters-container">
          <div className="RS-filter-buttons">
            <select
              className="RS-select-category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Fine Dining">Fine Dining</option>
              <option value="Cafe">Cafe</option>
              <option value="Buffet">Buffet</option>
              <option value="Quick Service">Quick Service</option>
            </select>

            <button
              className="RS-button RS-filter-toggle"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? "− Hide Filters" : "+ Show Filters"}
            </button>
          </div>

          {showFilters && (
            <div className="RS-advanced-filters">
              <select
                className="RS-select-filter"
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
              >
                <option value="">All Cuisines</option>
                <option value="Italian">Italian</option>
                <option value="Chinese">Chinese</option>
                <option value="French">French</option>
                <option value="American">American</option>
                <option value="Indian">Indian</option>
                <option value="Japanese">Japanese</option>
              </select>

              <select
                className="RS-select-filter"
                value={selectedDietary}
                onChange={(e) => setSelectedDietary(e.target.value)}
              >
                <option value="">All Dietary</option>
                <option value="Gluten-Free">Gluten-Free</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="None">None</option>
              </select>

              <select
                className="RS-select-filter"
                value={selectedSeating}
                onChange={(e) => setSelectedSeating(e.target.value)}
              >
                <option value="">All Seating</option>
                <option value="Indoor">Indoor</option>
                <option value="Terrace">Terrace</option>
                <option value="Lawn">Lawn</option>
              </select>

              <button 
                className="RS-button RS-clear-button"
                onClick={handleClearFilters}
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        <div className="RS-grid-container">
          {filteredRestaurants.length > 0 ? (
            filteredRestaurants.map((restaurant) => (
              <div key={restaurant._id} className="RS-card">
                <div className="RS-card-image-container">
                  <img
                    src={restaurant.image || '/default-restaurant.jpg'}
                    alt={restaurant.name}
                    className="RS-card-image"
                    onError={(e) => {
                      e.target.src = '/default-restaurant.jpg';
                    }}
                  />
                </div>
                <div className="RS-card-content">
                  <div className="RS-card-header">
                    <h2 className="RS-restaurant-name">{restaurant.name}</h2>
                  </div>
                  <div className="RS-tag-container">
                    <span className="RS-tag RS-cuisine-tag">
                      <FaUtensils className="RS-tag-icon" /> {restaurant.cuisine}
                    </span>
                    {restaurant.dietary !== "None" && (
                      <span className="RS-tag RS-dietary-tag">
                        {restaurant.dietary}
                      </span>
                    )}
                    <span className="RS-tag RS-seating-tag">
                      <FaChair className="RS-tag-icon" /> {restaurant.seating}
                    </span>
                  </div>
                  <div className="RS-restaurant-info">
                    <p className="RS-location">
                      <FaUsers className="RS-info-icon" /> {restaurant.location}
                    </p>
                    <p className="RS-contact">{restaurant.contact}</p>
                  </div>
                  <div className="RS-availability-info">
                    <div className="RS-availability-item">
                      <FaClock className="RS-availability-icon" />
                      {/* <span>10:00 AM - 10:00 PM</span> */}
                    </div>
                    <div className="RS-availability-item">
                      <FaUsers className="RS-availability-icon" />
                      <span>
                        {tableAvailability[restaurant._id]?.available || 0} of {tableAvailability[restaurant._id]?.total || 0} tables available
                      </span>
                    </div>
                  </div>
                  <Link 
                    to={`/bookrestaurant/restaurants/${restaurant._id}`}
                    className="RS-book-button"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="RS-no-results">
              <div className="RS-no-results-content">
                <span className="RS-no-results-icon">🍽️</span>
                <h3>No Restaurants Found</h3>
                <p>Try adjusting your filters to find more restaurants.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RestaurantList;