const express = require('express');
const http = require('http');  // For WebSocket
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const nationRoutes = require('./routes/nationRoutes');
const userRoutes = require('./routes/userRoutes');

const User = require('./models/User');
const PurchaseRequest = require('./models/PurchaseRequest');  // Make sure PurchaseRequest is imported
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// WebSocket setup
const WebSocket = require('ws');  // WebSocket library
const wss = new WebSocket.Server({ server });  // WebSocket server

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/users', userRoutes);



// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully!'))
  .catch(err => console.error('MongoDB connection error:', err));

// User Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password }).populate('nation');
  if (user) {
    res.json(user);
  } else {
    res.status(401).json({ error: 'Invalid username or password' });
  }
});

// Register New User
app.post('/api/register', async (req, res) => {
  const {
    username,
    password,
    profile,
    bankAccount = 1000,
    stats = { strength: 10, agility: 10, intelligence: 10 },
    isAdmin = false,
  } = req.body;
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    res.status(400).json({ error: 'Username already exists' });
  } else {
    const newUser = new User({ username, password, profile, bankAccount, stats, isAdmin });
    await newUser.save();
    res.status(201).json(newUser);
  }
});

// Create Purchase Request
app.post('/api/purchase', async (req, res) => {
  const { username, item, quantity, price } = req.body;
  const newRequest = new PurchaseRequest({ username, item, quantity, price });
  await newRequest.save();

  // Notify WebSocket clients about the new request
  notifyClients({ type: 'purchase-update', message: `New purchase request from ${username}` });

  res.status(201).json(newRequest);
});

// Get User-Specific Requests
app.get('/api/requests/:username', async (req, res) => {
  const { username } = req.params;
  const requests = await PurchaseRequest.find({ username });
  res.json(requests);
});

// Assign Nation to User
app.put('/api/users/:id/assign-nation', async (req, res) => {
  try {
    const { id } = req.params;
    const { nationId } = req.body;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.nation = nationId;
    await user.save();
    const updatedUser = await User.findById(id).populate('nation');
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to assign nation' });
  }
});

// WebSocket connection setup
wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Function to notify all WebSocket clients
const notifyClients = (message) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
};
// Attach `wss` to `req` and pass to nationRoutes
app.use('/api/nations', (req, res, next) => {
  req.wss = wss;
  next();
}, nationRoutes);
// Start the server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
