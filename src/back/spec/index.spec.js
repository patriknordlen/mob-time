var request = require("request");
var expect  = require("chai").expect;

describe("Mob Server", function() {
    describe("mob.pug", function() {
        it("returns 200", function(done){
            request.get("http://localhost:3000/", function(error, response, body){
                expect(response.statusCode).to.equal(200);
                done();
            });
        });
    });
});