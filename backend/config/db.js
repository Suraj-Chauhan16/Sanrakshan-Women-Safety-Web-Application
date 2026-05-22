const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB:', process.env.MONGODB_URI);
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB connected successfully');
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('Make sure MongoDB is running on localhost:27017');
    process.exit(1);
  }
};

module.exports = connectDB;
