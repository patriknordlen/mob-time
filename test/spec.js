var request = require("request");
var expect  = require("chai").expect;

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
            request.post("http://localhost:3000/start", function(error, response, body){
                expect(response.statusCode).to.equal(200);
            })
        });
    });
});