import React, { useState, useEffect } from "react";

const BookingDetails = () => {
    const [bookings, setBookings] = useState([]); // Store user's bookings
    const [loading, setLoading] = useState(true); // Loading state
    const [email, setEmail] = useState(null); // Logged-in user's email

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch logged-in user's email
                const emailResponse = await fetch("http://localhost:5000/user_get_mail");
                if (!emailResponse.ok) throw new Error("Failed to fetch email.");
                const emailData = await emailResponse.json();
                const userEmail = emailData.mail;
                setEmail(userEmail);

                // Fetch user bookings using the email
                const bookingsResponse = await fetch("http://localhost:5000/get_user_bookings", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email: userEmail }),
                });

                if (!bookingsResponse.ok) throw new Error("Failed to fetch bookings.");
                const bookingsData = await bookingsResponse.json();
                setBookings(bookingsData.bookings);
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
        Date of Booking: ${new Date(booking.date).toLocaleDateString()}  // The date the booking was made
        Slot: ${booking.slot}  // The slot time
        Contact Email: ${booking.contact_mail}
        User Email: ${email}  // The logged-in user's email
        Slot Timing: ${booking.slot}  // The slot time (booking's actual slot)
        `;
        const blob = new Blob([bookingDetails], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `booking-${booking._id}.txt`;
        link.click();
    };

    return (
        <div className="booking-details-container">
            <h3>My Bookings</h3>
            {loading ? (
                <p>Loading bookings...</p>
            ) : bookings.length > 0 ? (
                bookings.map((booking, index) => (
                    <div key={index} className="booking-item">
                        <h4>Booking {index + 1}</h4>
                        <p>
                            <strong>Label:</strong> {booking.label}
                        </p>
                        <p>
                            <strong>Date of Booking:</strong> {new Date(booking.date).toLocaleDateString()}
                        </p>
                        <p>
                            <strong>Slot:</strong> {booking.slot}
                        </p>
                        <p>
                            <strong>Address:</strong> {booking.address}
                        </p>
                        <button onClick={() => downloadDetails(booking)}>Download Details</button>
                        <hr />
                    </div>
                ))
            ) : (
                <p>No bookings found for your account.</p>
            )}
        </div>
    );
};

export default BookingDetails;
