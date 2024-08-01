const mongoose = require('mongoose');

const dbconnect = () => {
    mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Database connection established'))
    .catch((error) => console.log('Database connection error:', error));
};

module.exports = dbconnect;
