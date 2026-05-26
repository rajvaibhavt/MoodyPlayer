const mongoose = require("mongoose");

function connectDB() {
  const uri = process.env.MONGODB_URL;
  if (!uri) {
    return Promise.reject(new Error('Missing MONGODB_URL in environment'));
  }

  return mongoose.connect(uri)
    .then(() => {
      console.log("Connected to MongoDB");
    });
}

module.exports = connectDB;