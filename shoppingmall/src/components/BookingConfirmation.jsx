import React from 'react';
import "./css/bookingconfirmation.css";

function BookingConfirmation() {
  return (
    <div className="RS-confirmation-page">
      <h1 className="RS-confirmation-title">Booking Confirmation</h1>
      <p className="RS-confirmation-message">
        Your table has been successfully booked!
      </p>
      <p className="RS-confirmation-email-message">
        You will receive a confirmation email with the details shortly.
      </p>
      <button 
        className="RS-return-home-button" 
        onClick={() => window.location.href = '/'}
      >
        Return to Home
      </button>
    </div>
  );
}

export default BookingConfirmation;
