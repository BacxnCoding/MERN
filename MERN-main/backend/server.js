const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const nationRoutes = require('./routes/nationRoutes');
const userRoutes = require('./routes/userRoutes');
const roleRoutes = require('./routes/roleRoutes');  // Add the role routes
const User = require('./models/User');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(bodyParser.json());

//routes
app.use('/api/users', userRoutes);
app.use('/api/nations', nationRoutes);
app.use('/api', roleRoutes);  // Add the role routes

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully!'))
  .catch(err => console.error('MongoDB connection error:', err));

const purchaseRequestSchema = new mongoose.Schema({
  username: String,
  item: String,
  quantity: Number,
  status: { type: String, default: 'pending' },
  adminResponse: { type: String, default: '' },
  price: Number,
});

const PurchaseRequest = mongoose.model('PurchaseRequest', purchaseRequestSchema);

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

const notifyClients = (message) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
};

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
  notifyClients({ type: 'REQUEST_CREATED', request: newRequest });
  res.status(201).json(newRequest);
});

// Get Pending Purchase Requests
app.get('/api/requests', async (req, res) => {
  const requests = await PurchaseRequest.find({ status: 'pending' });
  res.json(requests);
});

// Approve or Deny Purchase Request
app.post('/api/approve', async (req, res) => {
  const { id, response, status } = req.body;
  const request = await PurchaseRequest.findById(id);
  if (!request) {
    return res.status(404).json({ error: 'Request not found' });
  }

  request.status = status;
  request.adminResponse = response;
  await request.save();

  if (status === 'approved') {
    const user = await User.findOne({ username: request.username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const itemPrices = {
      Sword: 100,
      Shield: 150,
      Potion: 50,
    };

    let itemPrice;
    if (itemPrices[request.item]) {
      itemPrice = itemPrices[request.item];
    } else if (request.price) {
      itemPrice = request.price;
    } else {
      return res.status(400).json({ error: 'Invalid item price' });
    }

    const itemIndex = user.items.findIndex(item => item.itemName === request.item);

    if (itemIndex >= 0) {
      user.items[itemIndex].quantity += request.quantity;
    } else {
      user.items.push({ itemName: request.item, quantity: request.quantity });
    }

    const totalCost = itemPrice * request.quantity;

    if (!isNaN(totalCost) && totalCost > 0) {
      user.bankAccount = Math.max(0, user.bankAccount - totalCost);
    } else {
      return res.status(400).json({ error: 'Invalid transaction amount' });
    }

    await user.save();
  }

  notifyClients({ type: 'REQUEST_UPDATED', request });
  res.status(200).json(request);
});

// Get User-Specific Requests
app.get('/api/requests/:username', async (req, res) => {
  const { username } = req.params;
  const requests = await PurchaseRequest.find({ username });
  res.json(requests);
});

// Get User Details
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('nation');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Get All Users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().populate('nation');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Update User
app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true }).populate('nation');
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    notifyClients({ type: 'USER_UPDATED', user: updatedUser });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
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
    notifyClients({ type: 'USER_UPDATED', user: updatedUser });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to assign nation' });
  }
});

// Assign Roles to User
app.put('/api/users/:id/assign-roles', async (req, res) => {
  try {
    const { id } = req.params;
    const { roles } = req.body; // Expecting roles to be an array of role strings
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.roles = roles;
    await user.save();
    const updatedUser = await User.findById(id).populate('nation');
    notifyClients({ type: 'USER_UPDATED', user: updatedUser });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to assign roles' });
  }
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
