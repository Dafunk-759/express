"use strict";

var express = require("../"),
  request = require("supertest");

describe("req", function () {
  describe(".param(name, default)", function () {
    it("should use the default value unless defined", function (done) {
      var app = express();

      app.use(function (req, res) {
        let p = req.param("name", "foo");
        console.log(p);
        res.end(p);
      });

      request(app).get("/").expect("foo", done);
    });
  });

  describe(".param(name)", function () {
    it("should check req.query", function (done) {
      var app = express();

      app.use(function (req, res) {
        console.log(req.param("age"));
        res.end(req.param("name"));
      });

      request(app).get("/?name=tj&age=18").expect("tj", done);
    });

    it("should check req.body", function (done) {
      var app = express();

      app.use(express.json());

      app.use(function (req, res) {
        console.log(req.param("age"));
        res.end(req.param("name"));
      });

      request(app).post("/").send({ name: "tj", age: 18 }).expect("tj", done);
    });

    it("should check req.params", function (done) {
      var app = express();

      app.get("/user/:name", function (req, res) {
        res.end(req.param("filter") + req.param("name"));
      });

      request(app).get("/user/tj").expect("undefinedtj", done);
    });
  });
});
