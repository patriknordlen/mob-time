var request = require("request");
var expect  = require("chai").expect;
var timer = require("../current-timer");

describe("Mob Server", function() {
    describe("index", function() {
        it("returns 200", function(){
            request.get("http://localhost:3000/", function(error, response, body){
                expect(response.statusCode).to.equal(200);
            })
        });
    });

    describe("start", function() {
        it("returns 200", function(){
            request.post("http://localhost:3000/start?time-left=12", function(error, response, body){
                expect(response.statusCode).to.equal(200);
            })
        });
        it("starts a timer of the given amount", function() {
            request.post("http://localhost:3000/start?time-left=12", function(error, response, body){
                expect(timer.timeLeft).to.equal(12 * 60);
            })
        });
    });
});