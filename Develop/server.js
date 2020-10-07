//Setting up the dependencies
const express = require("express");
var path = require("path");
const fs = require("fs");
let dbFile = require("./db/db.json");

//Setting up the express app
var app = express();
var PORT = process.env.PORT || 3000;

//Setting up data parsing functionality
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./public"));

//Setting the console log to the active port.
app.listen(PORT, function() {
  console.log("App is listening on PORT : " + PORT);
});

//HTML Routes that return html files
app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

//API Routes to GET
app.get("/api/notes", function(req, res) {
  res.json(dbFile);
});

//route
app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

var randomId;
//API Routes to POST
app.post("/api/notes", function(req, res) {
  let newNote = req.body;

  getRandomNum();
  console.log(randomId);

  newNote.id = randomId;
  dbFile.push(newNote);
  updateDBFile(dbFile);

  return res.json(dbFile);
});

//Gets a random number for ID while checking if its unique.
function getRandomNum() {
  randomId = Math.floor(Math.random() * Math.floor(100));
  while (randomId in dbFile) {
    randomId = Math.floor(Math.random() * Math.floor(100));
    console.log(randomId);
  }
}

//API Routes to DELETE
app.delete("/api/notes/:id", function(req, res) {
  let id = req.params.id;
  for (let i = 0; i < dbFile.length; i++) {
    if (dbFile[i].id == id) {
      dbFile.splice(i, 1);
      updateDBFile(dbFile);
      return res.json(dbFile);
    }
  }
});

//Update the DBFile when a certain array is changed or created. 
function updateDBFile(array) {
  fs.writeFileSync("./db/db.json", JSON.stringify(array));
}
