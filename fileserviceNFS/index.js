const express = require('express');
const pgp = require('pg-promise')();
const fs = require('fs');
const path = require('path');

const app = express();
const port = 5001; 

const db = pgp('postgres://snlzhszv:xfDLQZj4UEmIty-gt-H0xBO7djmMJFqr@tuffi.db.elephantsql.com/snlzhszv');

app.get('/export', async (req, res) => {
  try {
    // Fetch data from the database (adjust the query as needed)
    const data = await db.any('SELECT * FROM accounts');

    // Save data to a JSON file
    const filePath = path.join(__dirname, 'data', 'exported-data.json');
    fs.writeFileSync(filePath, JSON.stringify(data));

    // Set the appropriate headers for download
    res.setHeader('Content-disposition', 'attachment; filename=exported-data.json');
    res.setHeader('Content-type', 'application/json');

    // Create a read stream from the file and pipe it to the response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    console.log('Data exported successfully. File saved at:', filePath);
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Data Exporter Microservice is running at http://localhost:${port}`);
});
