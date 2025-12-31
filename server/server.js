const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Append extension
  }
});

const upload = multer({ storage: storage });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); // Increased limit for base64 images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Products Endpoints

// GET all products
app.get('/products', (req, res) => {
  const sql = 'SELECT * FROM products';
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server Error');
    }
    // Convert buffer/binary image back to string if needed, 
    // but mysql2 usually handles text fields as strings.
    // However, if LONGTEXT works as string, we are good.
    res.json(results);
  });
});

// POST new product
const baseUrl = `${req.protocol}://${req.get("host")}`;
const image = req.file ? `${baseUrl}/uploads/${req.file.filename}` : null;

  const sql = 'INSERT INTO products (id, name, price, description, category, image) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [id, name, price, description, category, image], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server Error');
    }
    res.status(201).send('Product added');
  });
});

// DELETE product
app.delete('/products/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM products WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server Error');
    }
    res.send('Product deleted');
  });
});

// Messages Endpoints

// GET all messages
app.get('/messages', (req, res) => {
  const sql = 'SELECT * FROM messages';
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server Error');
    }
    res.json(results);
  });
});

// POST new message
app.post('/messages', (req, res) => {
  const { id, name, email, message } = req.body;
  const sql = 'INSERT INTO messages (id, name, email, message) VALUES (?, ?, ?, ?)';
  db.query(sql, [id, name, email, message], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server Error');
    }
    res.status(201).send('Message sent');
  });
});

// DELETE message
app.delete('/messages/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM messages WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server Error');
    }
    res.send('Message deleted');
  });
});

// Login Endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const sql = 'SELECT * FROM admins WHERE username = ? AND password = ?';
  db.query(sql, [username, password], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server Error');
    }
    if (results.length > 0) {
      res.json({ success: true, message: 'Login successful' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
