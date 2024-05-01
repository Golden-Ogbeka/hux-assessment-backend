const mongoose = require('mongoose');

// Mongo DB
mongoose.set('strictQuery', false);

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.log(error);
    console.log("Couldn't connect to Mongo DB");
  }
};

module.exports = {
  connectMongoDB,
};
