const mongoose = require('mongoose');
const User = require('../models/User');

mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');

  const adminUser = new User({
    username: 'admin',
    password: 'admin123',
    isAdmin: true,
  });

  await adminUser.save();
  console.log('Admin user created');

  mongoose.connection.close();
});
