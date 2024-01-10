// account-management/index.js
const express = require('express');
const app = express();
const cors = require('cors');
const port = 3002; // Update the port if needed
const pgp = require('pg-promise')();
const path = require('path');

const db = pgp('postgres://snlzhszv:xfDLQZj4UEmIty-gt-H0xBO7djmMJFqr@tuffi.db.elephantsql.com/snlzhszv');

app.use(express.json());
app.use(express.static('public'));
app.use(cors());

// Get all accounts

app.get('/', async (req, res) => {
  console.log(req);
  const accounts = await db.any('SELECT * FROM accounts');
  res.json(accounts);    
});

app.get('/accounts', async (req, res) => {
  console.log(req);
  const accounts = await db.any('SELECT * FROM accounts');
  res.json(accounts);    
});

app.get('/banks', async (req, res) => {
  console.log(req);
  try {
    const accounts = await db.any('SELECT * FROM accounts');
    res.json(accounts);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Get accounts by bank id
app.get('/banks/:bankId', (req, res) => {
  if (req.headers.accept && req.headers.accept.includes('text/html')) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    // Handle JSON data retrieval for this route
    const bankId = req.params.bankId;
    db.any('SELECT * FROM accounts WHERE bank_id = $1', [bankId])
      .then(accounts => res.json(accounts))
      .catch(error => {
        console.error('Error fetching accounts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      });
  }
});

app.get('/clients', async (req, res) => {
  console.log(req);
  try {
    const accounts = await db.any('SELECT * FROM accounts');
    res.json(accounts);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Get accounts by client id
app.get('/clients/:clientId', (req, res) => {
  if (req.headers.accept && req.headers.accept.includes('text/html')) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    // Handle JSON data retrieval for this route
    const clientId = req.params.clientId;
    db.any('SELECT * FROM accounts WHERE client_id = $1', [clientId])
      .then(accounts => res.json(accounts))
      .catch(error => {
        console.error('Error fetching accounts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      });
  }
});

// Create a new account
app.post('/accounts', async (req, res) => {
  const { clientId, bankId, balance } = req.body;
  try {
    const newAccount = await db.one('INSERT INTO accounts(client_id, bank_id, balance) VALUES($1, $2, $3) RETURNING *', [clientId, bankId, balance]);
    res.json(newAccount);
  } catch (error) {
    console.error('Error creating account:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update account by ID
app.put('/accounts/:id', async (req, res) => {
  const accountId = req.params.id;
  const { clientId, bankId, balance } = req.body;
  try {
    const updatedAccount = await db.one('UPDATE accounts SET client_id = $1, bank_id = $2, balance = $3 WHERE id = $4 RETURNING *', [clientId, bankId, balance, accountId]);
    res.json(updatedAccount);
  } catch (error) {
    console.error('Error updating account:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete account by ID
app.delete('/accounts/:id', async (req, res) => {
  const accountId = req.params.id;
  try {
    await db.none('DELETE FROM accounts WHERE id = $1', [accountId]);
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/accounts/:accountId/deposit', async (req, res) => {
  try {
    const accountId = req.params.accountId;
    const { amount } = req.body;

    // Perform deposit operation (update the balance)
    const result = await db.one(
      'UPDATE accounts SET balance = balance + $1 WHERE id = $2 RETURNING *',
      [amount, accountId]
    );

    // Respond with the updated account information
    res.json(result);
  } catch (error) {
    console.error('Error depositing money:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.post('/accounts/:accountId/withdraw', async (req, res) => {
  try {
    const accountId = req.params.accountId;
    const { amount } = req.body;

    // Perform withdraw operation (update the balance)
    const result = await db.one(
      'UPDATE accounts SET balance = balance - $1 WHERE id = $2 RETURNING *',
      [amount, accountId]
    );

    // Respond with the updated account information
    res.json(result);
  } catch (error) {
    console.error('Error withdrawing money:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to handle transfer operation
app.post('/accounts/:fromAccountId/transfer/:toAccountId', async (req, res) => {
  try {
    const fromAccountId = req.params.fromAccountId;
    const toAccountId = req.params.toAccountId;
    const { amount } = req.body;

    // Perform transfer operation (update the balances for both accounts)
    const results = await db.tx(async (t) => {
      const fromAccount = await t.one(
        'UPDATE accounts SET balance = balance - $1 WHERE id = $2 RETURNING *',
        [amount, fromAccountId]
      );

      const toAccount = await t.one(
        'UPDATE accounts SET balance = balance + $1 WHERE id = $2 RETURNING *',
        [amount, toAccountId]
      );

      return { fromAccount, toAccount };
    });

    // Respond with the updated account information for both accounts
    res.json(results);
  } catch (error) {
    console.error('Error transferring money:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Account Management Microservice is running at http://localhost:${port}`);
});
