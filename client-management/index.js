// client-management/index.js
const express = require('express');
const app = express();
const cors = require('cors');
const port = 3001; // Update the port if needed
const pgp = require('pg-promise')();



const db = pgp('postgres://snlzhszv:xfDLQZj4UEmIty-gt-H0xBO7djmMJFqr@tuffi.db.elephantsql.com/snlzhszv');

app.use(express.json());
app.use(express.static('public'));
app.use(cors());

// Get all clients
app.get('/clients', async (req, res) => {
  try {
    const clients = await db.any('SELECT * FROM clients');
    res.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new client
app.post('/clients', async (req, res) => {
  const { name, email } = req.body;
  try {
    const newClient = await db.one('INSERT INTO clients(name, email) VALUES($1, $2) RETURNING *', [name, email]);
    res.json(newClient);
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update client by ID
app.put('/clients/:id', async (req, res) => {
  const clientId = req.params.id;
  const { name, email } = req.body;
  try {
    const updatedClient = await db.one('UPDATE clients SET name = $1, email = $2 WHERE id = $3 RETURNING *', [name, email, clientId]);
    res.json(updatedClient);
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete client by ID
app.delete('/clients/:id', async (req, res) => {
  const clientId = req.params.id;
  try {
    await db.none('DELETE FROM clients WHERE id = $1', [clientId]);
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get client operations by client ID
app.get('/clients/:id/operations', async (req, res) => {
  const clientId = req.params.id;
  try {
    const clientOperations = await db.any('SELECT * FROM client_operations WHERE client_id = $1', [clientId]);
    res.json(clientOperations);
  } catch (error) {
    console.error('Error fetching client operations:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Client Management Microservice is running at http://localhost:${port}`);
});
