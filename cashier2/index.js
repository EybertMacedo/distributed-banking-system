const express = require('express');
const app = express();
const cors = require('cors');
const port = 4002;
const pgp = require('pg-promise')();
const path = require('path');

const db = pgp('postgres://snlzhszv:xfDLQZj4UEmIty-gt-H0xBO7djmMJFqr@tuffi.db.elephantsql.com/snlzhszv');

app.use(express.json());
app.use(express.static('public'));
app.use(cors());


app.get('/clients/:clientId', (req, res) => {
  if (req.headers.accept && req.headers.accept.includes('text/html')) {
    res.sendFile(path.join(__dirname, 'public', 'accountOperations.html'));
  } else {
    const clientId = req.params.clientId;
    db.any('SELECT * FROM accounts WHERE client_id = $1', [clientId])
      .then(accounts => res.json(accounts))
      .catch(error => {
        console.error('Error fetching accounts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      });
  }
});

// Route for deposit
app.post('/accounts/:accountId/deposit', async (req, res) => {
  try {
    const accountId = req.params.accountId;
    const amount = req.body.amount;

    // Perform deposit operation in the database (adjust this query accordingly)
    await db.none('UPDATE accounts SET balance = balance + $1 WHERE id = $2', [amount, accountId]);

    res.status(200).json({ message: 'Deposit successful' });
  } catch (error) {
    console.error('Error during deposit:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route for transfer
app.post('/accounts/transfer', async (req, res) => {
  try {
    const fromAccountId = req.body.fromAccountId;
    const toAccountId = req.body.toAccountId;
    const amount = req.body.amount;

    // Perform transfer operation in the database (adjust this query accordingly)
    await db.tx(async t => {
      await t.none('UPDATE accounts SET balance = balance - $1 WHERE id = $2', [amount, fromAccountId]);
      await t.none('UPDATE accounts SET balance = balance + $1 WHERE id = $2', [amount, toAccountId]);
    });

    res.status(200).json({ message: 'Transfer successful' });
  } catch (error) {
    console.error('Error during transfer:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route for withdrawal
app.post('/accounts/:accountId/withdraw', async (req, res) => {
  try {
    const accountId = req.params.accountId;
    const amount = req.body.amount;

    // Perform withdrawal operation in the database (adjust this query accordingly)
    await db.none('UPDATE accounts SET balance = balance - $1 WHERE id = $2', [amount, accountId]);

    res.status(200).json({ message: 'Withdrawal successful' });
  } catch (error) {
    console.error('Error during withdrawal:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Cashier 2 - Paucarpata Microservice is running at http://localhost:${port}`);
});
