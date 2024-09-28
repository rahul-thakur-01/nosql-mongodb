const express = require('express');
const RentalProperty = require('../models/rentalProperty-schema');
const router = express.Router();

// Add a new rental property
router.post('/add', async (req, res) => {
    try {
        console.log(req.body);
        const { PROPERTYID, RENTALAMOUNT, NOOFBEDROOMS, LOCATION, CITY } = req.body;

        if (!RENTALAMOUNT || !NOOFBEDROOMS || !LOCATION || !CITY) {
            return res.status(400).json({ error: "NULL VALUES IN INPUT" });
        }
        if (RENTALAMOUNT <= 0 || NOOFBEDROOMS <= 0 || LOCATION.length === 0 || CITY.length === 0) {
            return res.status(400).json({ error: "INVALID INPUT" });
        }

        const validCities = ['Chennai', 'Bengaluru'];
        if (!validCities.includes(CITY.charAt(0).toUpperCase() + CITY.slice(1).toLowerCase())) {
            return res.status(400).json({ error: "INVALID CITY" });
        }

        const propertyId = `${CITY.slice(0, 3).toUpperCase()}${Math.floor(1000 + Math.random() * 9000)}`;

        const newProperty = new RentalProperty({
            PROPERTYID, RENTALAMOUNT, NOOFBEDROOMS, LOCATION, CITY
        });

        await newProperty.save();
        res.status(201).json({ message: `SUCCESS with Your Regno: ${propertyId}`, property: newProperty });
    } catch (err) {
        res.status(500).json({ message: 'Failed to add property', error: err.message });
    }
});

// Search rental properties by criteria
router.get('/search', async (req, res) => {
    try {
        const { minRentalAmount, maxRentalAmount, noOfBedrooms, location, city } = req.query;

        if (!minRentalAmount || !maxRentalAmount || !noOfBedrooms || !location || !city) {
            return res.status(400).json({ error: "INVALID VALUES" });
        }

        const properties = await RentalProperty.find({
            RENTALAMOUNT: { $gte: minRentalAmount, $lte: maxRentalAmount },
            NOOFBEDROOMS: noOfBedrooms,
            LOCATION: { $regex: new RegExp(location, 'i') }, 
            CITY: { $regex: new RegExp(city, 'i') }          
        });

        if (properties.length === 0) {
            return res.status(404).json({ message: 'NO MATCHING RECORDS' });
        }

        res.status(200).json({ message: `RECORDS AVAILABLE: ${properties.length}`, properties });
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving properties', error: err.message });
    }
});

// Fetch rental property based on criteria
router.get('/fetch', async (req, res) => {
    try {
        const { minRentalAmount, maxRentalAmount, noOfBedrooms, location, city } = req.query;

        if (!minRentalAmount || !maxRentalAmount || !noOfBedrooms || !location || !city || maxRentalAmount < minRentalAmount || noOfBedrooms <= 0) {
            return res.status(400).json({ error: "INVALID VALUES" });
        }

        const validCities = ['Chennai', 'Bengaluru'];
        if (!validCities.includes(city.charAt(0).toUpperCase() + city.slice(1).toLowerCase())) {
            return res.status(400).json({ error: "INVALID CITY" });
        }

        const properties = await RentalProperty.find({
            RENTALAMOUNT: { $gte: minRentalAmount, $lte: maxRentalAmount },
            NOOFBEDROOMS: noOfBedrooms,
            LOCATION: { $regex: new RegExp(location, 'i') }, 
            CITY: { $regex: new RegExp(city, 'i') }           
        });

        if (!properties || properties.length === 0) {
            return res.status(404).json({ message: "NO MATCHING RECORDS" });
        }

        res.json({ message: `RECORDS AVAILABLE: ${properties.length}`, properties });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Validate city
router.get('/validateCity', (req, res) => {
    const { city } = req.query;
    console.log(city);

    const validCities = ['Chennai', 'Bengaluru'];
    if (!validCities.includes(city.charAt(0).toUpperCase() + city.slice(1).toLowerCase())) {
        return res.status(400).json({ error: "INVALID CITY" });
    }

    res.json({ message: "VALID CITY" });
});

module.exports = router;
