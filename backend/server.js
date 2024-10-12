const express = require('express');
const http = require('http');  // For WebSocket
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const nationRoutes = require('./routes/nationRoutes');
const userRoutes = require('./routes/userRoutes');
const PurchaseRequest = require('./models/PurchaseRequest');
const User = require('./models/User');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// WebSocket setup
const WebSocket = require('ws');
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Pass `wss` to routes for real-time notifications
app.use('/api/nations', (req, res, next) => {
  req.wss = wss;
  next();
}, nationRoutes);

app.use('/api/users', (req, res, next) => {
  req.wss = wss;
  next();
}, userRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully!'))
  .catch(err => console.error('MongoDB connection error:', err));

// User Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password }).populate('nation');
    if (user) {
      res.json(user);
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Register New User
app.post('/api/register', async (req, res) => {
  const { username, password, profile, bankAccount = 1000, stats = { strength: 10, agility: 10, intelligence: 10 }, isAdmin = false } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    const newUser = new User({ username, password, profile, bankAccount, stats, isAdmin });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Create Purchase Request
app.post('/api/purchase', async (req, res) => {
  const { username, item, quantity, price } = req.body;
  try {
    const newRequest = new PurchaseRequest({ username, item, quantity, price });
    await newRequest.save();

    // Notify WebSocket clients about the new request
    notifyClients({ type: 'purchase-create', message: `New purchase request from ${username}` });

    res.status(201).json(newRequest);
  } catch (error) {
    console.error('Purchase request creation error:', error);
    res.status(500).json({ error: 'Failed to create purchase request' });
  }
});

// Approve or deny a purchase request
app.patch('/api/approve/:id', async (req, res) => {
  const { id } = req.params;
  const { status, response } = req.body;
  try {
    const request = await PurchaseRequest.findById(id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Update status and admin's response
    request.status = status;
    request.adminResponse = response;
    await request.save();

    // Notify WebSocket clients about the update
    notifyClients({ type: 'purchase-update', message: `Request ${id} has been ${status}.`, request });

    res.status(200).json(request);
  } catch (error) {
    console.error('Error approving/denying request:', error);
    res.status(500).json({ error: 'Failed to update request' });
  }
});

// Get User-Specific Requests
app.get('/api/requests/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const requests = await PurchaseRequest.find({ username });
    res.json(requests);
  } catch (error) {
    console.error('Error fetching user-specific requests:', error);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
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
    console.error('Error assigning nation:', error);
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

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
