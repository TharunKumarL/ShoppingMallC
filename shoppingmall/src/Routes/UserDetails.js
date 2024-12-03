const express = require("express");
const router = express.Router();
const User = require("../models/UserSchema"); 
const UserWallet = require("../models/userwallet");

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

router.post("/create_user_wallet", async (req, res) => {
    const { email, wallet_money, sports_bookings } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Find or create the wallet
        let wallet = await UserWallet.findOne({ Uid: user._id });
        if (!wallet) {
            wallet = new UserWallet({
                Uid: user._id,
                wallet_money: wallet_money || 0,
                sports_bookings: sports_bookings || [],
            });
        } else {
            // Update existing wallet
            wallet.wallet_money += wallet_money || 0;
            wallet.sports_bookings = [...wallet.sports_bookings, ...(sports_bookings || [])];
        }

        // Save the wallet
        await wallet.save();

        res.status(201).json({ message: "Wallet updated successfully", wallet });
    } catch (err) {
        console.error("Error creating/updating wallet:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



module.exports = router;
