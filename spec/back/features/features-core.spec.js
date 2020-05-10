const chai = require("chai");
const {isOn, activate, clean} = require("../../../src/back/features/core");
const expect = chai.expect;

describe("Features - core", () => {
    describe("isOn", () => {
        it('is off when the feature is neither in the server or the mob', function () {
            expect(isOn("pomodoro", "", "")).to.be.false;
        });
        it('is on when it is active for the server', function () {
            expect(isOn("pomodoro", "pomodoro,fasterTime", "")).to.be.true;
        });
        it('is not on when a similarly named feature is on for the server', function () {
            expect(isOn("pomodoro", "pomodoro2", "")).to.be.false;
        });
        it('is on when it is active for the mob', function () {
            expect(isOn("pomodoro", "", "pomodoro,fasterTime")).to.be.true;
        });
        it('is not on when a similarly named feature is on for the mob', function () {
            expect(isOn("pomodoro", "", "pomodoro2")).to.be.false;
        });
    });
    describe("activate", () => {
        it('adds the feature to the mob feature list', function () {
            expect(activate("pomodoro", "fasterTime", ["pomodoro", "fasterTime"])).to.equal("fasterTime,pomodoro");
        });
        it('does nothing for an unknown feature', function () {
            expect(activate("unknownFeature", "fasterTime", ["pomodoro", "fasterTime"])).to.equal("fasterTime");
        });
    });
    describe("clean", () => {
        [
            ["pomodoro,wut?,fasterTime,who?", "pomodoro,fasterTime"],
            ["pomodoro,wut?", "pomodoro"],
        ]
            .forEach(value => {
                it(`deletes the unknown features from the list: ${value[0]}`, function () {
                    expect(clean(value[0], ["pomodoro", "fasterTime"])).to.equal(value[1]);
                });
            })
    });
});