"use strict";

var after = require("after");
var express = require("../.."),
  request = require("supertest"),
  assert = require("assert");

describe("app.use()", function () {
  // it("some siliy test", function (done) {
  //   var fat = express();
  //   const sub = express();
  //   sub.use("/", (req, res, next) => {
  //     res.end();
  //   });

  //   // sub.on("mount", (app) => {
  //   //   console.log(app.__hello);
  //   // });

  //   fat.use("/foo", sub);

  //   assert.ok(sub.mountpath === "/foo");

  //   fat.set("hello", "world");
  //   // Object.keys(fat.settings).forEach((k) => console.log(k));

  //   request(fat)
  //     .get("/foo")
  //     .expect(200, (err) => {
  //       if (err) return done(err);
  //       request(fat).options("/foo").expect(200, done);
  //     });
  // });

  it("should restore req.params", function (done) {
    var app = express();
    var router = new express.Router({ mergeParams: true });

    router.get("/user:(\\w+)/*", function (req, res, next) {
      next();
    });

    app.use("/user/id:(\\d+)", function (req, res, next) {
      router(req, res, function (err) {
        console.log("restore", req.params);
        var keys = Object.keys(req.params).sort();
        res.send(
          keys.map(function (k) {
            return [k, req.params[k]];
          })
        );
      });
    });

    request(app)
      .get("/user/id:42/user:tj/profile")
      .expect(200, '[["0","42"]]', done);
  });
});
