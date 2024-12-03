import { useState, useEffect } from "react";
import "../css/UserWallet.css"; 

const UserWallet = () => {
    const [email, setEmail] = useState(null); // Store email
    const [details, setDetails] = useState(null); // Store user details

    // Fetch email and user details
    useEffect(() => {
        const fetchEmailAndDetails = async () => {
            try {
                // Step 1: Fetch email from `/user_get_mail`
                const emailResponse = await fetch("http://localhost:5000/user_get_mail");
                if (!emailResponse.ok) {
                    throw new Error(`Error fetching email: ${emailResponse.statusText}`);
                }

                const emailData = await emailResponse.json(); // Get email as JSON
                const userEmail = emailData.mail; // Extract `mail`
                setEmail(userEmail); // Update state

                // Step 2: Fetch user details using the email via POST request
                const detailsResponse = await fetch(
                    "http://localhost:5000/get_user_details", // POST to get user details
                    {
                        method: "POST", // Using POST
                        headers: {
                            "Content-Type": "application/json", // Indicate that we're sending JSON
                        },
                        body: JSON.stringify({ email: userEmail }), // Send email in the request body
                    }
                );

                if (!detailsResponse.ok) {
                    throw new Error(`Error fetching user details: ${detailsResponse.statusText}`);
                }

                const userDetails = await detailsResponse.json(); // Get user details as JSON
                setDetails(userDetails); // Update state with user details
            } catch (error) {
                console.error("Error fetching email or user details:", error);
            }
        };

        fetchEmailAndDetails(); // Call the function
    }, []); // Run only once when the component mounts

    return (
        <div>
            <div className="user-wallet-container">
                <h2>Hello User, how are you?</h2>
                <div className="user-wallet-box">
                    <div className="wallet-details">
                        <p className="wallet-details-heading">Your details</p>
                        <p className="wallet-amount">Wallet amount: ₹1000</p>
                    </div>
                    <hr /> 
                    
                    <h3>Email: {email ? email : "Loading email..."}</h3>
                </div>

                <div className="user-bookings">
                    Bookings
                    <hr /> 
                    {details ? (
                        <h2>{details.name}</h2> // Safely access `details.name`
                    ) : (
                        <p>Loading user details...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserWallet;
