import { useState, useEffect } from "react";
import "../css/UserWallet.css";
import BookingDetails from "../Userwallet/UserBookedDetails";

const UserWallet = () => {
    const [email, setEmail] = useState(null);
    const [details, setDetails] = useState(null);
    const [image, setImage] = useState(null); // Store image
    const [selectedImage, setSelectedImage] = useState(null); // For preview before upload

    // Fetch email and user details
    useEffect(() => {
        const fetchEmailAndDetails = async () => {
            try {
                const emailResponse = await fetch("http://localhost:5000/user_get_mail");
                const emailData = await emailResponse.json();
                const userEmail = emailData.mail;
                setEmail(userEmail);

                const detailsResponse = await fetch("http://localhost:5000/get_user_details", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email: userEmail }),
                });

                const userDetails = await detailsResponse.json();
                setDetails(userDetails);
                setImage(userDetails.image); // Set profile image
            } catch (error) {
                console.error("Error fetching details:", error);
            }
        };

        fetchEmailAndDetails();
    }, []);

    // Handle Image Upload
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        setSelectedImage(URL.createObjectURL(file)); // Show preview

        const formData = new FormData();
        formData.append('image', file);
        formData.append('email', email);

        try {
            const response = await fetch('http://localhost:5000/upload_profile_image', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Error uploading image.');
            }

            const data = await response.json();
            setImage(data.imagePath); // Update image on success
        } catch (error) {
            console.error('Image upload error:', error);
        }
    };

    return (
        <div>
            <div className="user-wallet-container">
                {details ? (
                    <h2>Hello {details.name}, look at your profile</h2>
                ) : (
                    <p>Loading user details...</p>
                )}

                {/* Display Profile Image */}
                <div className="profile-image-section">
                    {image && <img width="100px"  src={`http://localhost:5000${image}`} alt="Profile" />}
                    {!image && <p>No profile image uploaded.</p>}

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                    />

                    {/* Image Preview Before Upload */}
                    {selectedImage && (
                        <div className="image-preview">
                            <img src={selectedImage} alt="Preview" />
                        </div>
                    )}
                </div>

                <div className="user-wallet-box">
                    <div className="wallet-details">
                        <p className="wallet-details-heading">Your details</p>
                    </div>
                    <hr />

                    <h3>Email: {email ? email : "Loading email..."}</h3>
                </div>

                <div className="user-bookings">
                    <h3>My Bookings</h3>
                    <hr />
                    <BookingDetails email={email} />
                </div>
            </div>
        </div>
    );
};

export default UserWallet;
