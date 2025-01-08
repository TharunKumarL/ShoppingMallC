const express = require("express");
const router = express.Router();
const User = require("../models/UserSchema"); 
const UserWallet = require("../models/userwallet");
const sportbookings = require("../models/bookingSchema");
const userwalletschema = require("../models/userwallet");
const Sports = require("../models/sportSchema");



// Endpoint to get user details
router.post("/get_user_details", async (req, res) => {
    const { email } = req.body; // Get email from the request body
    try {
        const user = await User.findOne({ email: email }); // Fetch user by email
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user); // Send user details as JSON
    } catch (err) {
        console.error("Error fetching user details:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route to fetch all user bookings along with wallet and sport details
router.get("/booking-details/:userId", async (req, res) => {
    const { userId } = req.params; // User ID from URL parameter

    try {
        // Fetch user details
        const userDetails = await User.findById(userId);

        if (!userDetails) {
            return res.status(404).json({ message: "User not found" });
        }

        // Fetch all bookings by the user and populate sport details
        const bookings = await sportbookings
            .find({ user: userId }) // Assuming there is a `user` field in the bookingSchema
            .populate("sport_foreignkey") // Populate sport details
            .exec();

        // Fetch user wallet and populate sports_bookings with booking details
        const userWallet = await UserWallet.findOne({ Uid: userId })
            .populate("sports_bookings") // Populate sports_bookings
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



// Route to fetch all booking details for a user based on their email
// Assuming you've already created this in the backend route
router.post("/get_user_bookings", async (req, res) => {
    const { email } = req.body; // Extract email from the request body
    try {
        const userWallet = await UserWallet.findOne({ email })
            .populate({
                path: "sports_bookings",
                populate: {
                    path: "sport_foreignkey",
                    model: "sports",
                },
            });

        if (!userWallet || !userWallet.sports_bookings.length) {
            return res.status(404).json({ error: "No bookings found." });
        }

        const bookings = userWallet.sports_bookings.map((booking) => ({
            label: booking.sport_foreignkey.label,
            cost: booking.sport_foreignkey.cost,
            address: booking.sport_foreignkey.address,
            date: booking.date,
            slot: booking.slot,
            contact_mail: booking.sport_foreignkey.contact_mail,
        }));

        res.status(200).json({ bookings });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ error: "Server Error" });
    }
});




module.exports = router;
