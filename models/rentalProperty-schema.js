const mongoose = require('mongoose');

const rentalPropertySchema = new mongoose.Schema({
    PROPERTYID: { type: String, required: true },  
    RENTALAMOUNT: { type: Number, required: true },
    NOOFBEDROOMS: { type: Number, required: true },  
    LOCATION: { type: String, required: true },     
    CITY: { type: String, required: true }          
});


const RentalProperty = mongoose.model('RentalProperty', rentalPropertySchema);


module.exports = RentalProperty;
