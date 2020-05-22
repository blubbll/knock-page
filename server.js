// server.js

const //imports
  express = require("express"),
  app = express(),
  fetch = require("node-fetch");

//static
app.use(express.static("public"));

//start
app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/views/index.html`);
});

// forward ajaxes
app.get("/*", (req, res) => {
  fetch(`http://learn.knockoutjs.com${req.originalUrl}`)
    .then(r => r.json())
    .then(j => res.send(j));
});

// listen
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
