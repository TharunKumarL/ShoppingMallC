const express = require("express");
const router = express.Router();
const User = require("../models/UserSchema"); 
const UserWallet = require("../models/userwallet");
const sportbookings = require("../models/bookingSchema");

// Endpoint to get user details
router.post("/get_user_details", async (req, res) => {
    const { email } = req.body; // Get email from the request body
    try {
        const user = await User.findOne({ email: email }); // Assuming you use mongoose
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user); // Send user details as JSON
    } catch (err) {
        console.error("Error fetching user details:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
 

// route for creating a wallet for user 

router.get('/booking-details/:userId', async (req, res) => {
    const { userId } = req.params;  // User ID from URL parameter

    try {
        // Fetch user details
        const userDetails = await User.findById(userId);

        if (!userDetails) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch all bookings by the user, populate sport_foreignkey with sport details
        const bookings = await sportbookings.find({ 'user': userId })
            .populate('sport_foreignkey') // Populate sport_foreignkey
            .exec();

        // Fetch user wallet and populate sports_bookings with booking details
        const userWallet = await UserWallet.findOne({ Uid: userId })
            .populate('sports_bookings') // Populate sports_bookings
            .exec();

        // Prepare the response with all necessary data
        res.status(200).json({
            userDetails,
            bookings,
            userWallet,
        });
    } catch (error) {
        console.error("Error fetching booking details:", error);
        res.status(500).send("Server Error");
    }
});




module.exports = router;
