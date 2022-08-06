"use strict";

var express = require("../");
var request = require("supertest");

describe("app.route", function () {
  it("should return a new route", function (done) {
    var app = express();

    app
      .route("/foo")
      .get(function (req, res) {
        res.send("get");
      })
      .post(function (req, res) {
        res.send("post");
      });

    request(app)
      .post("/foo")
      .expect("post", (err) => {
        if (err) done(err);
        request(app).get("/foo").expect("get", done);
      });
  });

  it("should all .VERB after .all", function (done) {
    var app = express();

    app
      .route("/foo")
      .all(function (req, res, next) {
        console.log("all");
        next();
      })
      .get(function (req, res) {
        console.log("get");
        res.send("get");
      })
      .post(function (req, res) {
        console.log("post");
        res.send("post");
      });

    request(app).post("/foo").expect("post", done);
  });

  it("should support dynamic routes", function (done) {
    var app = express();

    app.route("/:foo").get(function (req, res) {
      res.send(req.params.foo);
    });

    request(app).get("/test").expect("test", done);
  });

  it("should not error on empty routes", function (done) {
    var app = express();

    app.route("/:foo");

    request(app).get("/test").expect(404, done);
  });
});
