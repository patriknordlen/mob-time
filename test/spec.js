var request = require("request");
var expect  = require("chai").expect;
var timer = require("../current-timer");

describe("Mob Server", function() {
    describe("index", function() {
        it("returns 200", function(done){
            request.get("http://localhost:3000/", function(error, response, body){
                expect(response.statusCode).to.equal(200);
                done();
            });
        });
    });

    describe("start", function() {
        it("returns 200", function(done){
            request.post("http://localhost:3000/start?timeLeft=12", function(error, response, body){
                expect(response.statusCode).to.equal(200);
                done();
            });
        });
        it("starts a timer of the given amount", function(done) {
            request.post("http://localhost:3000/start?timeLeft=14", function(error, response, body){
                expect(timer.timeLeft).to.equal(14 * 60);
                done();
            });
        });
    });
});