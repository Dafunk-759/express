"use strict";

var express = require("..");
var request = require("supertest");

describe("res", function () {
  describe(".get(field)", function () {
    it("should get the response header field", function (done) {
      var app = express();

      app.use(function (req, res) {
        res.setHeader("Content-Type", "text/x-foo");
        console.log(res.get("content-type"));
        res.send(res.get("Content-Type"));
      });

      request(app).get("/").expect(200, "text/x-foo", done);
    });
    it("should case-insensitive", (done) => {
      const app = express();
      app.use((req, res) => {
        res.setHeader("Content-Type", "text/x-bar");
        res.send(res.get("content-type"));
      });
      request(app).get("/").expect(200, "text/x-bar", done);
    });
  });
});
