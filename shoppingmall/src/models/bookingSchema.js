const user = require("./User");
const sports = require("./sportSchema");

const mongoose=require('mongoose')
const bookingSchema = new mongoose.Schema({
    sport_foreignkey: {
        type: mongoose.Schema.Types.ObjectId,
        ref: sports,
    },
    date: {
        type: Date, 
        required: true
    }, 
    slot: {
        type: String,
        required: true
    }, 
    booked_user_details: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: user
    }, 
    is_booked: {
        type: Boolean, 
        default: false
    },
    
});

module.exports = mongoose.model('sportbookings', bookingSchema);