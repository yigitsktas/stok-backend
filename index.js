const express = require('express');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(bodyParser.json());

const DATA_FILE = path.join(__dirname, 'data', 'products.json');

// Routes
app.get('/api/products', (req, res) => {
  if (!fs.existsSync(DATA_FILE)) return res.json([]);
  const data = fs.readFileSync(DATA_FILE);
  res.json(JSON.parse(data));
});

app.post('/api/products', (req, res) => {
  const products = fs.existsSync(DATA_FILE) ? JSON.parse(fs.readFileSync(DATA_FILE)) : [];
  const newProduct = { id: Date.now(), ...req.body };
  products.push(newProduct);
  fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2));
  res.status(201).json(newProduct);
});

app.delete('/api/products/:id', (req, res) => {
  if (!fs.existsSync(DATA_FILE)) return res.status(204).end();
  let products = JSON.parse(fs.readFileSync(DATA_FILE));
  products = products.filter(p => p.id != req.params.id);
  fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2));
  res.status(204).end();
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === '1234') {
    res.json({ token: 'mock-token' });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});