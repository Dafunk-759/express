"use strict";

var express = require("../.."),
  request = require("supertest"),
  assert = require("assert");

describe("Router", function () {
  it("some siliy test", function (done) {
    const router = express.Router();
    Object.keys(router).forEach((k) => console.log(k));
    done();
  });
});
