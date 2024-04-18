// required modules
const express = require('express');
const path = require('path');

// creating the app
const app = express();

// middlewares
app.use(express.json());
app.use(express.static('public'));

// routes
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './db/db.json'));
});

// app.post('/api/notes', (req, res) => {

// });

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'))
});

// app listener
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`your app is running at https://localhost:${PORT}`);
});