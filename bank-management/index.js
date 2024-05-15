// client-management/index.js
const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000; // Update the port if needed
const pgp = require('pg-promise')();

const db = pgp('postgres://snlzhszv:xfDLQZj4UEmIty-gt-H0xBO7djmMJFqr@tuffi.db.elephantsql.com/snlzhszv');


app.use(express.json());
app.use(express.static('public'));
app.use(cors());

// Get all banks
app.get('/banks', async (req, res) => {
  try {
    const banks = await db.any('SELECT * FROM banks');
    res.json(banks);
  } catch (error) {
    console.error('Error fetching banks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Get bank accounts by ID
app.get('/banks/:id/accounts', async (req, res) => {
  const bankId = req.params.id;
  try {
    const clientOperations = await db.any('SELECT * FROM client_operations WHERE client_id = $1', [clientId]);
    res.json(clientOperations);
  } catch (error) {
    console.error('Error fetching client operations:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Banks Management Microservice is running at http://localhost:${port}`);
});
