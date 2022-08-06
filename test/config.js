"use strict";

var assert = require("assert");
var express = require("..");

describe("config", function () {
  describe(".set()", function () {
    it("should set a value", function () {
      var app = express();
      app.set("foo", "bar");
      console.log("foo", app.get("foo"));
      assert.equal(app.get("foo"), "bar");
    });

    it("should set prototype values", function () {
      var app = express();
      app.set("hasOwnProperty", 42);
      app.set("prototype", "proto");
      assert.strictEqual(app.get("hasOwnProperty"), 42);
      assert.strictEqual(app.get("prototype"), "proto");
    });

    it("should return the app", function () {
      var app = express();
      assert.equal(app.set("foo", "bar"), app);
      assert.strictEqual(app.set("baz", "qux"), app);
    });

    it("should return the app when undefined", function () {
      var app = express();
      assert.equal(app.set("foo", undefined), app);
    });

    it("should return set value", function () {
      var app = express();
      app.set("foo", "bar");
      app.set("baz", "qux");
      console.log("return set value", app.set("baz"));
      app.set("baz", undefined);
      console.log("return set value", app.get("baz"));
      assert.strictEqual(app.set("foo"), "bar");
    });

    it("should return undefined for prototype values", function () {
      var app = express();
      assert.strictEqual(app.set("hasOwnProperty"), undefined);
      assert.strictEqual(app.set("toString"), undefined);
      assert.strictEqual(app.set("valueOf"), undefined);
      assert.ok(app instanceof Object);
    });

    describe('"etag"', function () {
      it("should throw on bad value", function () {
        var app = express();
        assert.throws(app.set.bind(app, "etag", 42), /unknown value/);
      });

      it('should set "etag fn"', function () {
        var app = express();
        var fn = function () {};
        app.set("etag", fn);
        assert.strictEqual(app.get("etag fn"), fn);
      });
    });

    describe('"trust proxy"', function () {
      it('should set "trust proxy fn"', function () {
        var app = express();
        var fn = function () {};
        app.set("trust proxy", fn);
        assert.strictEqual(app.get("trust proxy fn"), fn);
      });
    });
  });

  describe(".get()", function () {
    it("should return undefined when unset", function () {
      var app = express();
      assert.strictEqual(app.get("foo"), undefined);
    });

    it("should return undefined for prototype values", function () {
      var app = express();
      assert.strictEqual(app.get("hasOwnProperty"), undefined);
    });

    it("should otherwise return the value", function () {
      var app = express();
      app.set("foo", "bar");
      assert.equal(app.get("foo"), "bar");
    });

    describe("when mounted", function () {
      it("should default to the parent app", function () {
        var app = express();
        var blog = express();

        blog.set("hello", "world");
        app.set("title", "Express");
        app.set("age", "18");
        app.use(blog);
        assert.strictEqual(blog.get("title"), "Express");
        assert.strictEqual(blog.get("age"), "18");
        assert.strictEqual(blog.get("hello"), "world");
        assert.ok(app.get("hello") !== "world");
      });

      it("should given precedence to the child", function () {
        var app = express();
        var blog = express();

        app.use(blog);
        app.set("title", "Express");
        blog.set("title", "Some Blog foo bar");

        assert.equal(blog.get("title"), "Some Blog foo bar");
        assert.equal(app.get("title"), "Express");
      });

      it('should inherit "trust proxy" setting', function () {
        var app = express();
        var blog = express();

        function fn() {
          return false;
        }

        app.set("trust proxy", fn);
        assert.equal(app.get("trust proxy"), fn);
        assert.equal(app.get("trust proxy fn"), fn);

        app.use(blog);

        assert.equal(blog.get("trust proxy"), fn);
        assert.equal(blog.get("trust proxy fn"), fn);
      });

      it('should prefer child "trust proxy" setting', function () {
        var app = express();
        var blog = express();

        function fn1() {
          return false;
        }
        function fn2() {
          return true;
        }

        app.set("trust proxy", fn1);
        assert.equal(app.get("trust proxy"), fn1);
        assert.equal(app.get("trust proxy fn"), fn1);

        blog.set("trust proxy", fn2);
        assert.equal(blog.get("trust proxy"), fn2);
        assert.equal(blog.get("trust proxy fn"), fn2);

        app.use(blog);

        assert.equal(app.get("trust proxy"), fn1);
        assert.equal(app.get("trust proxy fn"), fn1);
        assert.equal(blog.get("trust proxy"), fn2);
        assert.equal(blog.get("trust proxy fn"), fn2);
      });
    });
  });

  describe(".enable()", function () {
    it("should set the value to true", function () {
      var app = express();
      assert.equal(app.enable("tobi"), app);
      console.log("tobi", app.get("tobi"));
      assert.strictEqual(app.get("tobi"), true);
    });

    it("should set prototype values", function () {
      var app = express();
      app.enable("hasOwnProperty");
      assert.strictEqual(app.get("hasOwnProperty"), true);
    });
  });

  describe(".disable()", function () {
    it("should set the value to false", function () {
      var app = express();
      assert.equal(app.disable("tobi"), app);
      assert.strictEqual(app.get("tobi"), false);
    });

    it("should set prototype values", function () {
      var app = express();
      app.disable("hasOwnProperty");
      assert.strictEqual(app.get("hasOwnProperty"), false);
    });
  });

  describe(".enabled()", function () {
    it("should default to false", function () {
      var app = express();
      assert.strictEqual(app.enabled("foo"), false);
      console.log("foo", app.get("foo"));
    });

    it("should return true when set", function () {
      var app = express();
      app.set("foo", "bar");
      assert.strictEqual(app.enabled("foo"), true);
    });

    it("should default to false for prototype values", function () {
      var app = express();
      assert.strictEqual(app.enabled("hasOwnProperty"), false);
    });
  });

  describe(".disabled()", function () {
    it("should default to true", function () {
      var app = express();
      assert.strictEqual(app.disabled("foo"), true);
    });

    it("should return false when set", function () {
      var app = express();
      app.set("foo", "bar");
      assert.strictEqual(app.disabled("foo"), false);
    });

    it("should default to true for prototype values", function () {
      var app = express();
      assert.strictEqual(app.disabled("hasOwnProperty"), true);
    });
  });
});
