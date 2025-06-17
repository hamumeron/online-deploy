const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');
const { nanoid } = require('nanoid');
const path = require('path');

const app = express();
const db = new sqlite3.Database('./database.db');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

db.run(`CREATE TABLE IF NOT EXISTS codes (
  id TEXT PRIMARY KEY,
  html TEXT,
  css TEXT,
  js TEXT
)`);

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/save', (req, res) => {
  const id = nanoid(8);
  const { html, css, js } = req.body;
  db.run(`INSERT INTO codes (id, html, css, js) VALUES (?, ?, ?, ?)`,
    [id, html, css, js], (err) => {
      if (err) return res.send('Error saving code');
      res.redirect(`/view/${id}`);
    });
});

app.get('/view/:id', (req, res) => {
  const id = req.params.id;
  db.get(`SELECT * FROM codes WHERE id = ?`, [id], (err, row) => {
    if (!row) return res.send('Code not found');
    res.render('code', { html: row.html, css: row.css, js: row.js });
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Running on port ${port}`));
