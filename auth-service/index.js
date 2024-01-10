// auth-service.js
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const pgp = require('pg-promise')();
const port = 3004;

const db = pgp('postgres://snlzhszv:xfDLQZj4UEmIty-gt-H0xBO7djmMJFqr@tuffi.db.elephantsql.com/snlzhszv');

app.use(bodyParser.json());
app.use(cors());

// Endpoint for user login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user exists and validate the password
    const user = await db.oneOrNone('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);

    if (user) {
        // Include clientId in the response
        res.json({ role: user.role, clientId: user.client_id });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(port, () => {
  console.log(`Authentication Microservice is running at http://localhost:${port}`);
});
