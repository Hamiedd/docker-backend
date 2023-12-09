const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');

const app = express();
const port = 8080;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));

// MySQL configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'node'
};

// Connection pool
const pool = mysql.createPool(dbConfig);

app.get('/', (req, res) => {
  res.render('index'); // Render the index.ejs file
});


app.get('/register', (req, res) => {
  res.render('registration'); // Render the registration.ejs file
});

// Routes for signup and signin
app.post('/signup', async (req, res) => {
  const { phone, password } = req.body;

  // Validate input
  if (!phone || !password) {
    return res.status(400).json({ message: 'phone and password are required.' });
  }

  try {
    // Get a connection from the pool
    const connection = await pool.getConnection();

    // Check if the username already exists
    const [existingUser] = await connection.query('SELECT * FROM users WHERE phone = ?', [phone]);
    if (existingUser.length > 0) {
      connection.release();
      return res.status(409).json({ message: 'phone already exists.' });
    }

    // Insert the new user
    const [result] = await connection.query('INSERT INTO users (phone, password) VALUES (?, ?)', [phone, password]);

    connection.release();
    res.render('index');
  } catch (error) {
    console.error('Error during signup:', error);
    return res.status(500).json({ message: 'Internal Server Error.' });
  }
});

app.post('/signin', async (req, res) => {
  const { phone, password } = req.body;

  // Validate input
  if (!phone || !password) {
    return res.status(400).json({ message: 'phone and password are required.' });
  }

  try {
    // Get a connection from the pool
    const connection = await pool.getConnection();

    // Check if the user exists
    const [user] = await connection.query('SELECT * FROM users WHERE phone = ? AND password = ?', [phone, password]);
    if (user.length === 0) {
      connection.release();
      return res.status(401).json({ message: 'Invalid phone or password.' });
    }

    connection.release();
    res.render('start');
  } catch (error) {
    console.error('Error during signin:', error);
    return res.status(500).json({ message: 'Internal Server Error.' });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
