const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    process.env.MONGO_SECRET_URL
  );
};

module.exports = connectDB;
