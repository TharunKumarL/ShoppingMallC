import React from "react";
import "./css/infinitescroller.css";

const InfiniteScroll = ({ offers }) => {
  return (
    <div className="scroll-container">
      <div className="scroll-content">
        {/* Render offers twice to simulate infinite scrolling */}
        {offers.map((offer, index) => (
          <span key={`offer-${index}`} className="offer-item">
            {offer}
          </span>
        ))}
        {offers.map((offer, index) => (
          <span key={`offer-duplicate-${index}`} className="offer-item">
            {offer}
          </span>
        ))}
      </div>
    </div>
  );
};

export default InfiniteScroll;
