const express = require("express");
const router = express.Router();
const User = require("../models/UserSchema");

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


module.exports = router;
