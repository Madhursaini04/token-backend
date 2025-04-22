const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = () => {

    mongoose.connect(process.env.MONGO_URL)
        .then(() => {
            console.log("✅ Database connected successfully");
        })

        .catch((error) => {
            console.log("❌ Error connecting to database:", error);
        });
};

module.exports = connectDB;

