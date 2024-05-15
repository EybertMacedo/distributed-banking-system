// transaction-management/index.js
const express = require('express');
const app = express();
const cors = require('cors');
const port = 3003; // Choose an appropriate port
const pgp = require('pg-promise')();

const db = pgp('postgres://snlzhszv:xfDLQZj4UEmIty-gt-H0xBO7djmMJFqr@tuffi.db.elephantsql.com/snlzhszv');

app.use(express.json());
app.use(cors());

// Add necessary routes for handling transactions

app.listen(port, () => {
  console.log(`Transaction Management Microservice is running at http://localhost:${port}`);
});
