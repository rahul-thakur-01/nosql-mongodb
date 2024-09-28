const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rentalPropertyRoutes = require('./routes/rentalProperty-route');

const app = express();
const PORT = 3000;


app.use(bodyParser.json());


mongoose.connect('mongodb+srv://rahulthakurdeveloper:rahul@cluster0.wjbgg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((err) => console.error('Error connecting to MongoDB:', err));


// Use routes
app.use('/properties', rentalPropertyRoutes);



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
