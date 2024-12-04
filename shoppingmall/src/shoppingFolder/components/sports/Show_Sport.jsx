import React, { useEffect, useState } from "react";
// import "../../../App.css";
import "../css/Show_Sport.css";
import BookSlot from "./Booking_Sport"; // Import the BookSlot component


const Show_Sport = ({ isOwner }) => {
    const get_data_url = "http://localhost:5000/sport/owner/get";
    const delete_data_url = "http://localhost:5000/sport/owner/delete/";
    const update_data_url = "http://localhost:5000/sport/owner/update/";

    const [data, setData] = useState([]);
    const [isDataAvailable, setIsDataAvailable] = useState(false);
    const [selectedSport, setSelectedSport] = useState(null); // Track selected sport

    const handleBoxClick = (sportId) => {
        setSelectedSport(prev => (prev === sportId ? null : sportId)); // Toggle popup visibility
    };

    const handlePopupClick = (e) => {
        e.stopPropagation(); // Prevent closing popup when clicking inside
    };


    useEffect(() => {
        fetch(get_data_url)
            .then((res) => res.json())
            .then((data) => {
                setData(data);
                setIsDataAvailable(true);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const handleDelete = (id) => {
        const confirmation = prompt("Type 'delete' to confirm deletion:");
        if (confirmation === "delete") {
            fetch(`${delete_data_url}${id}`, {
                method: "DELETE",
            })
                .then((res) => {
                    if (res.ok) {
                        setData(data.filter((item) => item._id !== id)); // Update local state
                        alert("Item deleted successfully.");
                    } else {
                        alert("Failed to delete the item.");
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };



    const handleUpdate = (id) => {
        // Find the existing item data
        const itemToUpdate = data.find(item => item._id === id);

        if (!itemToUpdate) {
            alert("Item not found");
            return;
        }

        fetch(`${update_data_url}${id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                label: itemToUpdate.label,
                body: itemToUpdate.body,
                cost: itemToUpdate.cost,
                address: itemToUpdate.address,
                contact_mail: itemToUpdate.contact_mail,
                slot_timings: itemToUpdate.slot_timings,
                date: itemToUpdate.date
            })
        })
            .then((res) => {
                if (res.ok) {
                    // Update local state with new data
                    setData(data.map(item =>
                        item._id === id ? itemToUpdate : item
                    ));
                    alert("Item updated successfully.");
                } else {
                    alert("Failed to update the item.");
                }
            })
            .catch((err) => {
                console.log("Error has occurred", err);
                alert("Unable to update");
            });
    };

    return (
        <div className="show-sport">
            <div className="sport-items-container">
                {isDataAvailable &&
                    data.map((item, index) => (
                        <div
                            key={index}
                            className="sport-item-box"
                            onClick={() => handleBoxClick(item._id)}
                        >


                            {isOwner && (
                                <button onClick={(e) => { e.stopPropagation(); handleDelete(item._id); }}>
                                    <span className="material-symbols-outlined">delete</span>
                                </button>
                            )}


                            {/* Bottom Section for Label, Price, and Matter Box */}
                            <div className="sport-item-info">
                                <p className="sport-item-label">{item.label}</p>
                                <hr />
                                <div className="price-and-matter">
                                    <p className="price">Price: {item.cost}</p>
                                </div>
                            </div>

                            {/* Popup with BookSlot */}
                            {selectedSport === item._id && (
                                <div
                                    className="popup-box"
                                    onClick={() => setSelectedSport(null)} // Close popup on outside click
                                >
                                    <div
                                        className="popup-content"
                                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                                    >
                                        <div className="matter-details">
                                            <div>
                                                {/* Sport Details */}
                                                <h2>{item.label}</h2>
                                                <p>{item.body}</p>
                                                <p className="bold"> Address: {item.address}</p>
                                            </div>

                                            <div>
                                                {/* Close Button */}
                                                <button
                                                    className="close-popup-btn material-symbols-outlined"
                                                    onClick={() => setSelectedSport(null)}
                                                >
                                                    Close
                                                </button>
                                            </div>
                                        </div>

                                        {/* BookSlot Component */}
                                        <hr />
                                        <BookSlot sportId={item._id} />
                                    </div>
                                </div>
                            )}

                        </div>
                    ))}
            </div>
        </div>
    );
};

export default Show_Sport;
