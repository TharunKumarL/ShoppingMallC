const mongoose=require("mongoose"); 


const sportSchema = new mongoose.Schema(
    {
        label: {
            type: String, 
            required: true,
        }, 
        body: {
            type: String, 
            required: true,
        },
        cost: {
            type: Number, 
            required: true,
        }, 
        address: {
            type: String, 
            required: true
        },
        contact_mail: {
            type: String, 
            required: true
        }
    }
);

module.exports = mongoose.model('sports', sportSchema);