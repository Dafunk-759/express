"use strict";

var assert = require("assert");
var express = require("../"),
  fs = require("fs");
var path = require("path");

function render(path, options, fn) {
  // console.log("options:", options);
  fs.readFile(path, "utf8", function (err, str) {
    if (err) return fn(err);
    str = str
      .replace("{{user.name}}", options.user.name)
      .replace("{{user.age}}", options.user.age);
    fn(null, str);
  });
}

describe("app", function () {
  describe(".engine(ext, fn)", function () {
    it("should map a template engine", function (done) {
      var app = express();

      app.set("views", path.join(__dirname, "fixtures"));
      app.engine(".html", render);
      app.locals.user = { name: "tobi", age: 18 };
      // console.log("locals:", app.locals);

      app.render("user.html", function (err, str) {
        if (err) return done(err);
        console.log("str:", str);
        assert.strictEqual(str, "<p>tobi</p>\n<p>18</p>");
        done();
      });
    });

    it("should throw when the callback is missing", function () {
      var app = express();
      assert.throws(function () {
        app.engine(".html", null);
      }, /callback function required/);
    });

    it('should work without leading "."', function (done) {
      var app = express();

      app.set("views", path.join(__dirname, "fixtures"));
      app.engine("html", render);
      app.locals.user = { name: "tobi", age: 18 };

      app.render("user.html", function (err, str) {
        if (err) return done(err);
        assert.strictEqual(str, "<p>tobi</p>\n<p>18</p>");
        done();
      });
    });

    it('should work "view engine" setting', function (done) {
      var app = express();

      app.set("views", path.join(__dirname, "fixtures"));
      app.engine("html", render);
      app.set("view engine", "html");
      app.locals.user = { name: "tobi", age: 18 };

      app.render("user", function (err, str) {
        if (err) return done(err);
        assert.strictEqual(str, "<p>tobi</p>\n<p>18</p>");
        done();
      });
    });

    it('should work "view engine" with leading "."', function (done) {
      var app = express();

      app.set("views", path.join(__dirname, "fixtures"));
      app.engine(".html", render);
      app.set("view engine", ".html");
      app.locals.user = { name: "tobi", age: 18 };

      app.render("user", function (err, str) {
        if (err) return done(err);
        assert.strictEqual(str, "<p>tobi</p>\n<p>18</p>");
        done();
      });
    });
  });
});
