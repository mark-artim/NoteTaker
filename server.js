const express = require('express');
const path = require('path');
// const http = require('http');
const fs = require('fs');
const db = require('./db/db.json');
var uniqid = require('uniqid');
const { request } = require('http');
// Sets up the Express App

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static('public'));

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Basic route that sends the user first to the AJAX Page
app.get('/', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/notes.html')));

app.get('/api/notes',(req,res)=>{
    fs.readFile('db/db.json', 'utf8', (err, data) => {
        let parsedData = JSON.parse(data);
        // console.log(parsedData);
        return res.json(parsedData);
    })
})

app.post('/api/notes',(req,res)=>{
    fs.readFile('db/db.json', 'utf8', (err, data) => {
        let parsedData = JSON.parse(data); // I am an array of all notes
        //Let's generate a unique ID for the new note
        const newNote = req.body;
        newNote.id = uniqid(); 
        //make newNote in to a string
        const newNoteParsed = JSON.stringify(newNote);
        console.log(`NNP: ${newNoteParsed}`);
        parsedData.push(newNote); //add newNote to the end of notes array
        //now make the array with the new note back into a string
        const stringData = JSON.stringify(parsedData);
        //write the whole array of notes back to db.json
        fs.writeFile('db/db.json', stringData, (err) => {
            if (err)
              console.log(err);
              else{
                return res.json(newNote);
              }
        })
    })
})

app.delete('/api/notes/:id', function (req,res) {
    console.log("Got a DELETE Request!");
    console.log(req.params.id);
    var delIndx = "";
    fs.readFile('db/db.json', 'utf8', (err, data) => {
        let parsedData = JSON.parse(data);
        console.log(parsedData);
        parsedData.forEach((element, index) => {
            var { id } = element;
            if (id === req.params.id) {
                console.log("Holy shit! I found " + id + "and it's id is "+ index);
                delIndx = index;
                parsedData.splice(index,1,);
                fs.writeFile('db/db.json', JSON.stringify(parsedData), (err) => {
                    if (err)
                      console.log(err);
                      else{
                        return
                      }
                    })
            } else {
                console.log('Do not delete this one: ' + id);
            };
        });
        
        if (err)
              console.log(err);
              else{
                console.log('I think I just deleted note #'+ delIndx);
                return res.json(parsedData)
              };
    });
});

function delIndex(requestedId) {
    return id === requestedId
}

// Starts the server to begin listening

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));