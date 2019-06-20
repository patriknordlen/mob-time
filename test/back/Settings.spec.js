const Settings = require("../../src/back/Settings");
var expect  = require("chai").expect;

describe("Settings", function () {
   describe("turn left", function () {
       it("accept turn length in minutes", function (done) {
           let settings = new Settings({turnLengthInMinutes: 12});
           expect(settings.turnLengthInMinutes).to.equal(12);
           done();
       });
       it("defaults to 10 minutes", function (done) {
           let settings = new Settings({});
           expect(settings.turnLengthInMinutes).to.equal(10);
           done();
       });
       it("defaults to 10 minutes even without a prototype", function (done) {
           let settings = new Settings();
           expect(settings.turnLengthInMinutes).to.equal(10);
           done();
       });
   });
});