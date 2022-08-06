"use strict";

var express = require("../../");

var app = (module.exports = express());

// app.get("/", function (req, res) {
//   res.send("Hello World");
// });

app.head("/", (req, res) => {
  res.writeHead(200, { "x-head-stupid": "fuck" });
  res.end();
});

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log("Express started on port 3000");
}
