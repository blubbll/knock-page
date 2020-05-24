// server.js

const //imports
  express = require("express"),
  app = express(),
  fetch = require("node-fetch"),
      fs = require("fs");

//static
app.use(express.static("public"));


// routing / ajax forwarding
app.get("/*", (req, res) => {
  if(req.originalUrl.includes("?"))
  fetch(`http://learn.knockoutjs.com${req.originalUrl}`)
    .then(r => r.json())
    .then(j => res.send(j));
  else{
    res.send(fs.readFileSync(`${__dirname}/views/index.html`, "utf8").replace("{{from}}", req.originalUrl));
  }
});

// listen
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
