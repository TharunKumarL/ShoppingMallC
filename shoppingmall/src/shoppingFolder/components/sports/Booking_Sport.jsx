import React, { useEffect, useState } from "react";
import "../css/BookSlot.css";

const PORT = 5000;

const BookSlot = ({ sportId }) => {
    const [slotsByDate, setSlotsByDate] = useState({});
    const [expandedDate, setExpandedDate] = useState(null); // Tracks the expanded date
    const [selectedSlot, setSelectedSlot] = useState(null);

    useEffect(() => {
        const fetchAvailableSlots = async () => {
            try {
                const response = await fetch(`http://localhost:${PORT}/sport/slots/${sportId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();

                // Group slots by date
                const groupedSlots = data.reduce((acc, slot) => {
                    const formattedDate = new Date(slot.date).toLocaleDateString();
                    if (!acc[formattedDate]) acc[formattedDate] = [];
                    acc[formattedDate].push({
                        id: slot._id,
                        slot: slot.slot,
                        isBooked: slot.is_booked,
                    });
                    return acc;
                }, {});
                setSlotsByDate(groupedSlots);
            } catch (error) {
                console.error("Error fetching available slots:", error);
            }
        };
        fetchAvailableSlots();
    }, [sportId]);

    const handleBooking = async () => {
        if (!selectedSlot) return;
    
        try {
            const token = sessionStorage.getItem("token");
    
            // Book the slot
            const bookingResponse = await fetch(`http://localhost:${PORT}/sport/booking/${selectedSlot}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ is_booked: true }),
            });
    
            if (!bookingResponse.ok) {
                throw new Error(`HTTP error! status: ${bookingResponse.status}`);
            }
    
            // After successful booking, trigger wallet creation/update
            const email = sessionStorage.getItem("email"); // Assuming email is stored in sessionStorage
            const walletResponse = await fetch(`http://localhost:${PORT}/create_user_wallet`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    email: email,
                    wallet_money: 100, // Example value to update/add wallet money
                    sports_bookings: [selectedSlot], // Add the booked slot to wallet
                }),
            });
    
            if (!walletResponse.ok) {
                throw new Error(`HTTP error! status: ${walletResponse.status}`);
            }
    
            // Update slots after booking
            setSlotsByDate((prev) =>
                Object.fromEntries(
                    Object.entries(prev).map(([date, slots]) => [
                        date,
                        slots.map((slot) =>
                            slot.id === selectedSlot ? { ...slot, isBooked: true } : slot
                        ),
                    ])
                )
            );
    
            alert("Slot booked and wallet updated successfully!");
            setSelectedSlot(null);
        } catch (error) {
            console.error("Error during slot booking or wallet update:", error);
        }
    };
    

    return (
        <div className="bookslot-container">
            <h2 className="bookslot-header">Available Slots</h2>
            <ul className="date-list">
                {Object.entries(slotsByDate).map(([date, slots]) => (
                    <li key={date} className="date-item">
                        <button
                            className={`date-button ${
                                expandedDate === date ? "expanded" : ""
                            }`}
                            onClick={() =>
                                setExpandedDate((prev) => (prev === date ? null : date))
                            }
                        >
                            
                            {date}
                        </button>
                        {expandedDate === date && (
                            <div className="slots-container">
                                <ul className="slots-list">
                                    {slots.map((slot) => (
                                        <li key={slot.id} className="slot-item">
                                            <button
                                                className={`slot-button ${
                                                    selectedSlot === slot.id
                                                        ? "selected"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    !slot.isBooked &&
                                                    setSelectedSlot(slot.id)
                                                }
                                                disabled={slot.isBooked} >
                                                {slot.slot}{" "}
                                                {slot.isBooked ? "(Booked)" : ""}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                                {selectedSlot && (
                                    <button
                                        className="book-slot-button"
                                        onClick={handleBooking}
                                    >
                                        Book Slot
                                    </button>
                                )}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BookSlot;
