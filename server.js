// required modules
const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid');

// creating the app
const app = express();

// middlewares
app.use(express.json());
app.use(express.static('public'));

// routes
app.get('/notes', (req, res) => {
  return res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => {
  return res.sendFile(path.join(__dirname, './db/db.json'));
});

app.post('/api/notes', (req, res) => {
  const { title, text } = req.body;

  if (title && text) {
    fs.readFile(path.join(__dirname, './db/db.json'), 'utf-8', (err, data) => {
      err ? console.log('trouble reading the file') : console.log(data);
      
      let notes = JSON.parse(data);

      // Variable for the object we will save
      const newNote = {
        title: title,
        text: text,
        id: uuid.v1()
      };

      notes.push(newNote);

      fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(notes), (err) => {
        err ? console.log('there was an error adding the note') : console.log('A new note has been added!');
      });
  
      return res.json(newNote);
    })
  } else {
    return res.send(err);
  }
});

app.get('*', (req, res) => {
  return res.sendFile(path.join(__dirname, './public/index.html'))
});

// app listener
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`your app is running at https://localhost:${PORT}`);
});