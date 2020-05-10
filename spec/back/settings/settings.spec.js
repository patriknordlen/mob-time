const chai = require("chai");
const {toSettings} = require("../../../src/back/settings/settings");
const expect = chai.expect;

describe("Mob Settings", () => {
    describe("length", () => {
        it('is 10 minutes by default', function () {
            let settings = toSettings({});
            let length = settings.lengthInMinutes;
            expect(length).to.be.equal(10);
        });
        it('is the provided length', function () {
            let settings = toSettings({lengthInMinutes: 8});
            let length = settings.lengthInMinutes;
            expect(length).to.be.equal(8);
        });
    });
    describe("Pomodoro", () => {
        it('is inactive by default', function () {
            let settings = toSettings({});
            expect(settings.pomodoro.active).to.be.false;
        });
        it('is the provided status', function () {
            let settings = toSettings({pomodoro: {active: true}});
            expect(settings.pomodoro.active).to.be.true;
        });
        it('is the number of turns provided', function () {
            let settings = toSettings({pomodoro: {active: true, turns: 4}});
            expect(settings.pomodoro.turns).to.be.equal(4);
        });
        it('is 3 turns by default', function () {
            let settings = toSettings({pomodoro: {active: true}});
            expect(settings.pomodoro.turns).to.be.equal(3);
        });
    });
});