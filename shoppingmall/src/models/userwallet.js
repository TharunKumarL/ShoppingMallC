const mongoose = require('mongoose');
const { Schema } = mongoose;

const userwalletSchema = new Schema({
    Uid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Reference to the User model
    },
    wallet_money: {
        type: Number, 
        required: true, 
        default: 0,
        min: 0,
        max: 100000,
    },
    sports_bookings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sports',  // Reference to the sports model
        required: false,
    }],
}, {
    timestamps: true,
});

module.exports = mongoose.model('userwallet', userwalletSchema);
