"use strict";

var after = require("after");
var express = require("../"),
  request = require("supertest");

describe("app.all()", function () {
  it("should add a router per method", function (done) {
    var app = express();
    var cb = after(4, done);

    app.all("/tobi", function (req, res) {
      // console.log("rea.method", req.method);
      res.end(req.method);
    });

    request(app).put("/tobi").expect(200, "PUT", cb);
    request(app).get("/tobi").expect(200, "GET", cb);
    request(app).post("/tobi").expect(200, "POST", cb);
    request(app).delete("/tobi").expect(200, "DELETE", cb);
  });

  it("should run the callback for a method just once", function (done) {
    var app = express(),
      n = 0;

    app.all("/*", function (req, res, next) {
      console.log("n", n);
      if (n++) return done(new Error("DELETE called several times"));
      next();
    });
    request(app).del("/tobi").expect(404, done);
  });
});
