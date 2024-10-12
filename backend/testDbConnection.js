const mongoose = require('mongoose');

// Replace with your MongoDB Atlas connection string
const uri = 'mongodb+srv://MunathonAdmin:l5fyxFZrxvNPgfXts@munathon.yqm8s.mongodb.net/?retryWrites=true&w=majority&appName=Munathon';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connection successful!');
    return mongoose.connection.close();  // Close connection after successful test
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
