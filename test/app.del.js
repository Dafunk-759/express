"use strict";

var express = require("../"),
  request = require("supertest"),
  after = require("after");

describe("app.del()", function () {
  it("should alias app.delete()", function (done) {
    var app = express();
    let cb = after(2, done);

    app.del("/tobi", function (req, res) {
      res.end("deleted tobi!");
    });

    app.del("/jq", (req, res) => {
      res.end("jq");
    });

    request(app).del("/tobi").expect("deleted tobi!", cb);
    request(app).del("/jq").expect("jq", cb);
  });
});
