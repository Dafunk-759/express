"use strict";

var express = require("../"),
  request = require("supertest"),
  cookieParser = require("cookie-parser");

describe("req", function () {
  describe(".signedCookies", function () {
    it("should return a signed JSON cookie", function (done) {
      var app = express();

      app.use(cookieParser("secret"));

      app.use(function (req, res) {
        if (req.path === "/set") {
          // console.log("/set", req.signedCookies);
          res.cookie("obj", { foo: "bar" }, { signed: true });
          res.end();
        } else {
          console.log("/", req.signedCookies);
          res.send(req.signedCookies);
        }
      });

      request(app)
        .get("/set")
        .end(function (err, res) {
          // console.log(res.header);
          if (err) return done(err);
          var cookie = res.header["set-cookie"];
          // cookie = cookie[0].split(";");
          // cookie = [cookie.join(";")];
          // console.log(cookie)

          request(app)
            .get("/")
            .set("Cookie", cookie)
            .expect(200, { obj: { foo: "bar" } }, done);
        });
    });
  });
});
