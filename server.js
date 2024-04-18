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
      if(err) {
        console.log('There was trouble reaching your notes. Please try again.')
      } else {
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
      };
    });
  } else {
    console.log('Please enter a note title and description.');
  };
});

app.delete('/api/notes/:id', (req, res) => {
  const id = req.params.id;

  fs.readFile(path.join(__dirname, './db/db.json'), 'utf-8', (err, data) => {
    if (err) {
      console.log('There was trouble reaching your notes. Please try again.')
    } else {
      let notes = JSON.parse(data);
      console.log(req.params.id);

      for (i = 0; i < notes.length; i++) {
        if (notes[i].id === req.params.id) {
          notes.splice(i, 1);
        }
      }

      fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(notes), (err) => {
        err ? console.log('there was an error removing the note') : console.log('A note has been removed!');
      });

      return res.json(notes);
    }
  });
});

app.get('*', (req, res) => {
  return res.sendFile(path.join(__dirname, './public/index.html'))
});

// app listener
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`your app is running at http://localhost:${PORT}`);
});