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
app.get('/notes', (req, res) => {                                     // WHEN the GET request is called at /notes
  return res.sendFile(path.join(__dirname, './public/notes.html'));   // THEN the notes.html page will be displayed
});

app.get('/api/notes', (req, res) => {                                 // WHEN the GET request is called at /api/notes
  return res.sendFile(path.join(__dirname, './db/db.json'));          // THEN the notes database will be displayed
});

app.post('/api/notes', (req, res) => {                                                        // WHEN the POST request is called at /api/notes
  const { title, text } = req.body;                                                           // THEN the information within the requests body is destructured

  if (title && text) {                                                                        // IF the request contains a note title and note text
    fs.readFile(path.join(__dirname, './db/db.json'), 'utf-8', (err, data) => {         // THEN the notes database will be read
      if(err) {                                                                                 // IF there is an error reading the file
        console.log('There was trouble reaching your notes. Please try again.')                 // THEN the user will be prompted to try again
      } else {                                                                                  // IF there are no errors
        let notes = JSON.parse(data);                                                           // THEN the data within the database file is parsed into an array of objects called "notes"

        // Variable for the object we will save
        const newNote = {                                                                       // THEN a new note is created with the request body info
          title: title,                                                                         // THEN the title is set to the user's title input
          text: text,                                                                           // THEN the text is set to the users text input
          id: uuid.v1()                                                                         // THEN uuid will create a unique item for the note
        };

        notes.push(newNote);                                                                    // THEN the new note is added to the notes array

        fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(notes), (err) => {    // THEN the database file is written to
          if (err) {                                                                            // IF there is an error
            console.log('there was an error adding the note');                                  // THEN the user will be alerted that there was an error
          } else {                                                                              // IF there are no errors
            console.log('A new note has been added!');                                          // THEN the user will be alerted that a note was added
          }  
        });
    
        return res.json(newNote);                                                               // THEN the response is returned
      };
    });
  } else {                                                                                    // IF the request does not contain a note title and note text
    console.log('Please enter a note title and description.');                                // THEN the user will be asked to enter a title and description
  };
});

app.delete('/api/notes/:id', (req, res) => {                                                  // WHEN the DELETE request is called on the .api/notes/:id path
  fs.readFile(path.join(__dirname, './db/db.json'), 'utf-8', (err, data) => {                 // THEN the database file is read
    if (err) {                                                                                // IF there is an error
      console.log('There was trouble reaching your notes. Please try again.')                 // THEN the user will be alerted to try again
    } else {                                                                                  // IF there are no errors
      let notes = JSON.parse(data);                                                           // THEN the data within the database file is parsed into an array of objects called "notes"
      for (i = 0; i < notes.length; i++) {                                                    // FOR each note in the array
        if (notes[i].id === req.params.id) {                                                      // IF the note id matches the id if the delete request
          removedNote = notes.splice(i, 1);                                                       // THEN the note is removed from the array
        }
      }

      fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(notes), (err) => {    // THEN the file is written with all the notes
        if (err) {                                                                                // IF there is an error
          console.log('there was an error removing the note');                                    // THEN the user is alerted that there was an error
        } else {                                                                                  // IF there are no errors
          console.log('A note has been removed!');                                                // THEN the user is alerted that a note was deleted
        }
      });

      return res.json(removedNote);                                                               // THEN the removed note is returned
    }
  });
});

app.get('*', (req, res) => {                                            // WHEN the GET requesr is called is called on anything other than our specified paths
  return res.sendFile(path.join(__dirname, './public/index.html'))      // THEN the homepage is returned
});

// app listener
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`your app is running at http://localhost:${PORT}`);
});