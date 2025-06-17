const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');
const { nanoid } = require('nanoid');
const app = express();
const db = new sqlite3.Database('./database.db');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

db.run(`CREATE TABLE IF NOT EXISTS codes (
  id TEXT PRIMARY KEY,
  lang TEXT,
  code TEXT
)`);

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/save', (req, res) => {
  const id = nanoid(8);
  const { lang, code } = req.body;
  db.run(`INSERT INTO codes (id, lang, code) VALUES (?, ?, ?)`, [id, lang, code], (err) => {
    if (err) return res.send('Error saving');
    res.redirect(`/view/${id}`);
  });
});

app.get('/view/:id', (req, res) => {
  db.get(`SELECT * FROM codes WHERE id = ?`, [req.params.id], (err, row) => {
    if (!row) return res.send('Not found');
    res.render('view', { lang: row.lang, code: row.code });
  });
});

app.listen(process.env.PORT || 3000, () => console.log('Running'));
