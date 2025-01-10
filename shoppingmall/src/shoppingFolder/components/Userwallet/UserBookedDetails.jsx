import React, { useState, useEffect } from "react";
import "../css/BookingDetails.css"; // Import a separate CSS file for styling

const BookingDetails = () => {
    const [userBookings, setUserBookings] = useState([]);
    const [restaurantBookings, setRestaurantBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch user email
                const emailResponse = await fetch("http://localhost:5000/user_get_mail");
                if (!emailResponse.ok) throw new Error("Failed to fetch email.");
                const emailData = await emailResponse.json();
                const userEmail = emailData.mail;
                setEmail(userEmail);

                // Fetch user bookings
                const userBookingsResponse = await fetch("http://localhost:5000/get_user_bookings", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email: userEmail }),
                });

                if (!userBookingsResponse.ok) throw new Error("Failed to fetch user bookings.");
                const userBookingsData = await userBookingsResponse.json();
                setUserBookings(userBookingsData.bookings);

                // Fetch restaurant bookings
                const restaurantBookingsResponse = await fetch("http://localhost:5000/get_restaurant_bookings");
                if (!restaurantBookingsResponse.ok) throw new Error("Failed to fetch restaurant bookings.");
                const restaurantBookingsData = await restaurantBookingsResponse.json();
                setRestaurantBookings(restaurantBookingsData.bookings);

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const downloadDetails = (booking) => {
        const bookingDetails = `
        Booking Details:
        -----------------
        Label: ${booking.label}
        Address: ${booking.address}
        Cost: ₹${booking.cost}
        Date of Booking: ${new Date(booking.date).toLocaleDateString()}
        Slot: ${booking.slot}
        Contact Email: ${booking.contact_mail}
        User Email: ${email}
        `;
        const blob = new Blob([bookingDetails], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `booking-${booking._id}.txt`;
        link.click();
    };

    return (
        <div className="booking-details-container">
            {loading ? (
                <p>Loading bookings...</p>
            ) : (
                <>
                    {/* User Bookings Section */}
                    <div>
                        <h4>Sport</h4>
                        {userBookings.length > 0 ? (
                            userBookings.map((booking, index) => (
                                <div key={index} className="ticket-container">
                                    <div className="ticket">
                                        <h4>{booking.label}</h4>
                                        <p>
                                            <strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}
                                        </p>
                                        <p>
                                            <strong>Slot:</strong> {booking.slot}
                                        </p>
                                        <p>
                                            <strong>Address:</strong> {booking.address}
                                        </p>
                                        <p>
                                            <strong>Cost:</strong> ₹{booking.cost}
                                        </p>
                                        <button onClick={() => downloadDetails(booking)} className="download-button">
                                            Download Ticket
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No user bookings found.</p>
                        )}
                    </div>

                    {/* Restaurant Bookings Section */}
                    <h4>Restaurant</h4>
                    <div className="restaurantBookings">
                        {restaurantBookings.length > 0 ? (
                            restaurantBookings.map((booking, index) => (
                                <div key={index} className="ticket-container">
                                    <div className="ticket">
                                        <h4>{booking.label}</h4>
                                        <p>
                                            <strong>Date:</strong> {new Date(booking.createdAt).toLocaleDateString()}
                                        </p>
                                        <p>
                                            <strong>Name:</strong> {booking.name}
                                        </p>
                                        <p>
                                            <strong>Phone:</strong> {booking.phone}
                                        </p>
                                        <p>
                                            <strong>TableId:</strong> {booking.tableId}
                                        </p>
                                        <button onClick={() => downloadDetails(booking)} className="download-button">
                                            Download Ticket
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No restaurant bookings found.</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default BookingDetails;
