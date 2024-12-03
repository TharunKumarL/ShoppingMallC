const { type } = require("os");
const User = require("./UserSchema"); 
const sports = require("./sportSchema");


const mongoose=require('mongoose')
const userwallet = new mongoose.Schema({
    Uid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
    },
    wallet_money: {
        type: Number, 
        required: true, 
        default: 0,
        min: 0 ,
        max: 100000,
    },  
    sports_bookings: {
        type: [mongoose.Schema.Types.ObjectId], 
        ref: sports,
        required:false,
    } ,
},  {
    timeseries: true
}
);



module.exports = mongoose.model('userwallet', userwallet);