import React, { useState, useEffect } from "react";

const BookingDetails = () => {
    const [bookings, setBookings] = useState([]); // Store bookings
    const [filteredBookings, setFilteredBookings] = useState([]); // Store filtered bookings
    const [loading, setLoading] = useState(true); // Loading state
    const [email, setEmail] = useState(null); // Logged-in user's email

    useEffect(() => {
        const fetchEmailAndBookings = async () => {
            try {
                // Step 1: Fetch email from /user_get_mail
                const emailResponse = await fetch("http://localhost:5000/user_get_mail");
                if (!emailResponse.ok) {
                    throw new Error(`Error fetching email: ${emailResponse.statusText}`);
                }

                const emailData = await emailResponse.json(); // Get email as JSON
                const userEmail = emailData.mail; // Extract email
                setEmail(userEmail); // Update state

                // Step 2: Fetch all bookings
                const bookingsResponse = await fetch("http://localhost:5000/get_all_bookings", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!bookingsResponse.ok) {
                    throw new Error(`Error fetching bookings: ${bookingsResponse.statusText}`);
                }

                const allBookings = await bookingsResponse.json(); // Parse bookings
                setBookings(allBookings); // Store all bookings

                // Step 3: Filter bookings matching the user's email
                const userBookings = allBookings.filter(
                    (booking) => booking.email === userEmail
                );
                setFilteredBookings(userBookings); // Update filtered bookings
            } catch (error) {
                console.error("Error fetching email or bookings:", error);
            } finally {
                setLoading(false); // Stop loading spinner
            }
        };

        fetchEmailAndBookings(); // Call the function
    }, []); // Empty dependency array ensures this runs only once

    return (
        <div className="booking-details-container">
            <h3>My Bookings</h3>
            {loading ? (
                <p>Loading bookings...</p>
            ) : filteredBookings.length > 0 ? (
                filteredBookings.map((booking, index) => (
                    <div key={index} className="booking-item">
                        <h4>Booking {index + 1}</h4>
                        <p><strong>Email:</strong> {booking.email}</p>
                        <p><strong>Date:</strong> {new Date(booking.createdAt).toLocaleString()}</p>
                        <p><strong>Sports Bookings:</strong></p>
                        <ul>
                            {booking.sports_bookings.map((sport, i) => (
                                <li key={i}>{sport}</li>
                            ))}
                        </ul>
                        <hr />
                    </div>
                ))
            ) : (
                <p>No bookings found for your email.</p>
            )}
        </div>
    );
};

export default BookingDetails;
