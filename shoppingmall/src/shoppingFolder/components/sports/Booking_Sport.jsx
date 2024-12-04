import React, { useEffect, useState } from "react";
import "../css/BookSlot.css";

const PORT = 5000;

const BookSlot = ({ sportId }) => {
    const [slotsByDate, setSlotsByDate] = useState({});
    const [expandedDate, setExpandedDate] = useState(null); // Tracks the expanded date
    const [selectedSlot, setSelectedSlot] = useState(null); 
    const [email, setEmail] = useState(null);

    useEffect(() => {
        const fetchAvailableSlots = async () => {
            try {
                const response = await fetch(`http://localhost:${PORT}/sport/slots/${sportId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json(); 


                const email = await fetch("http://localhost:5000/user_get_mail") 
                if (!email.ok) {
                    throw new Error(`Error fetching email: ${email.statusText}`);
                }

                const emailData = await email.json(); // Get email as JSON
                const userEmail = emailData.mail; // Extract `mail`
                setEmail(userEmail); // Update state

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
                body: JSON.stringify({ is_booked: true, email:email }), // Passing the email to this route
            });
    
            if (!bookingResponse.ok) {
                throw new Error(`HTTP error! status: ${bookingResponse.status}`);
            }
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
