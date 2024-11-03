import React, { useEffect, useState } from "react";
import '../css/BookSlot.css';
import fetchUserDetails from "../UserDetails/fetchUserDetails";


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
            const token = sessionStorage.getItem("token");
    
            const response = await fetch(`http://localhost:${PORT}/sport/booking/${selectedSlot}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`, // Include token in headers
                },
                body: JSON.stringify({ is_booked: true })
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            setAvailableSlots(prevSlots =>
                prevSlots.map(slot =>
                    slot.id === selectedSlot
                        ? { ...slot, isBooked: true }
                        : slot
                )
            );
    
            alert("Slot booked successfully!");
            setSelectedSlot(null);
        } catch (error) {
            console.error("Error booking slot:", error);
        }
    };
    
    

    return (
        <div>
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

            {/* <button onClick={get_details}> Give me User Details</button> */}
            
        </div>
        
        </div>
    );
};

export default BookSlot;
