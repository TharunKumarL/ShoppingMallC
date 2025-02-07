import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import InfiniteScroll from "./InfiniteScroller";
import "./css/restaurantlist.css";

function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [selectedDietary, setSelectedDietary] = useState("");
  const [selectedSeating, setSelectedSeating] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const offers = [
    "50% off on your first order!",
    "Buy 1 Get 1 Free on selected items!",
    "Free delivery for orders above $50!",
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
        const response = await fetch("http://localhost:5000/api/hotels");
        const data = await response.json();
        setRestaurants(data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };

    fetchRestaurants();
  }, []);

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

  return (
    <div className="RS-container">
      <div>
        <h1>Today's Offers</h1>
        <InfiniteScroll offers={offers} />
      </div>
      <h1 className="RS-header">Available Restaurants</h1>

      <div className="RS-filters-container">
        <div className="RS-filter-buttons">
          <select
            className="RS-select-category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Fast Food">Fast Food</option>
            <option value="Cafe">Cafe</option>
            <option value="Fine Dining">Fine Dining</option>
            <option value="Buffet">Buffet</option>
          </select>

          <button
            className="RS-button"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        {showFilters && (
          <div>
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

            <button className="RS-button RS-clear-button" onClick={handleClearFilters}>
              Clear Filters
            </button>
          </div>
        )}
      </div>

      <div className="RS-grid-container">
        {filteredRestaurants.length > 0 ? (
          filteredRestaurants.map((restaurant) => (
            <Link
              to={`/bookrestaurant/Restaurants/${restaurant._id}`}
              key={restaurant._id}
              className="RS-card"
            >
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="RS-card-image"
              />
              <div className="RS-card-content">
                <div className="RS-card-header">
                  <h2 className="RS-restaurant-name">{restaurant.name}</h2>
                </div>
                <div className="RS-tag-container">
                  <span className="RS-tag RS-cuisine-tag">
                    {restaurant.cuisine}
                  </span>
                  {restaurant.dietary !== "None" && (
                    <span className="RS-tag RS-dietary-tag">
                      {restaurant.dietary}
                    </span>
                  )}
                  <span className="RS-tag RS-seating-tag">{restaurant.seating}</span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="RS-no-results">
            No restaurants found matching the selected filters.
          </div>
        )}
      </div>
    </div>
  );
}

export default RestaurantList;
