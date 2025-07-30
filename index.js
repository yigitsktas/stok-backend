const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(bodyParser.json());

const PRODUCTS_FILE = './data/products.json';
const USERS = [{ username: 'admin', password: '1234' }];

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = USERS.find(u => u.username === username && u.password === password);
  if (user) res.json({ success: true });
  else res.status(401).json({ success: false, message: 'Invalid credentials' });
});

app.get('/api/products', (req, res) => {
  const data = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'));
  res.json(data);
});

app.post('/api/products', (req, res) => {
  const data = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'));
  const newProduct = { id: Date.now(), ...req.body };
  data.push(newProduct);
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(data, null, 2));
  res.json(newProduct);
});

app.delete('/api/products/:id', (req, res) => {
  let data = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'));
  data = data.filter(p => p.id !== parseInt(req.params.id));
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(data, null, 2));
  res.json({ success: true });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));