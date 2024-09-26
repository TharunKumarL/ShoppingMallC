import React, { useEffect, useState } from "react";
import '../css/BookSlot.css';

const PORT = 5000;

const BookSlot = ({ sportId }) => {
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);

    useEffect(() => {
        const fetchAvailableSlots = async () => {
            try {
                const response = await fetch(`http://localhost:${PORT}/sport/slots/${sportId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                
                // Ensure the response contains the expected structure
                if (Array.isArray(data)) {
                    const slotsToDisplay = data.map(slot => ({
                        id: slot._id,
                        slot: slot.slot,
                        date: new Date(slot.date).toLocaleDateString(), // Format the date
                        isBooked: slot.is_booked
                    }));
                    setAvailableSlots(slotsToDisplay);
                } else {
                    console.error("Expected an array for available slots, got:", data);
                }
            } catch (error) {
                console.error("Error fetching available slots:", error);
            }
        };

        fetchAvailableSlots();
    }, [sportId]);

    const handleBooking = async () => {
        if (!selectedSlot) return;

        try {
            const response = await fetch(`http://localhost:${PORT}/sport/booking/${selectedSlot}`, {
                method: "PUT", // Assuming you want to update the booking status
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ is_booked: true })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Update the available slots state to reflect the booked status
            setAvailableSlots(prevSlots =>
                prevSlots.map(slot =>
                    slot.id === selectedSlot ? { ...slot, isBooked: true } : slot
                )
            );
            alert("Slot booked successfully!");
            setSelectedSlot(null); // Clear the selected slot
        } catch (error) {
            console.error("Error booking slot:", error);
        }
    };

    return (
        <div className="bookslot">
            <h2>Available Slots</h2>
            <ul>
                {availableSlots.map((slotInfo) => (
                    <li key={slotInfo.id}>
                        <button
                            style={{
                                backgroundColor: slotInfo.isBooked ? "lightgray" : selectedSlot === slotInfo.id ? "lightblue" : "white",
                                cursor: slotInfo.isBooked ? "not-allowed" : "pointer",
                                pointerEvents: slotInfo.isBooked ? "none" : "auto"
                            }}
                            onClick={() => !slotInfo.isBooked && setSelectedSlot(slotInfo.id)} // Only set selectedSlot if not booked
                        >
                            {slotInfo.slot} on {slotInfo.date} {slotInfo.isBooked ? "(Booked)" : ""}
                        </button>
                    </li>
                ))}
            </ul>
            <button onClick={handleBooking} disabled={!selectedSlot}>
                Book Slot
            </button>
        </div>
    );
};

export default BookSlot;
