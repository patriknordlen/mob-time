const store = require("../../src/back/stores/stores").get();
const pomodoro = require("../../src/back/pomodoro");
const settings = require("../../src/back/mob/settings");
const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const expect = chai.expect;
chai.use(sinonChai);

function aMob() {
    return {
        formatVersion: 1,
        lengthInMinutes: 10,
        pomodoro: {
            active: true,
            turns: 3
        }
    };
}

describe("Pomodoro", () => {
    const sandbox = sinon.createSandbox();

    beforeEach(() => {
        process.env.FEATURES = "pomodoro";
        sandbox.stub(store);
        sandbox.stub(settings);
    })
    afterEach(() => sandbox.restore());

    describe("When a turn was started", () => {

        it("Starts", async () => {
            const mob = aMob();
            mob.lengthInMinutes = 10;
            mob.pomodoro.turns = 3;
            settings.get.resolves(mob);
            let start = new Date("2020-05-03T16:09:55.587Z");

            await pomodoro.get().turnStarted('test-mob', start);

            const pomodoroDoc = `{"formatVersion":1,"start":"2020-05-03T16:09:55.587Z","length":30}`;
            expect(store.save).to.have.been.calledOnceWith('test-mob-pomodoro', pomodoroDoc);
        });
        it("Does not start when the feature is disabled", async () => {
            process.env.FEATURES = "";

            await pomodoro.get().turnStarted('test-mob', new Date());

            expect(store.save).to.not.have.been.called;
        });
        it("Does not start if pomodoro is not active in the room", async () => {
            let mob = aMob();
            mob.pomodoro.active = false;
            settings.get.resolves(mob);
            await pomodoro.get().turnStarted('test-mob', new Date());

            expect(store.save).to.not.have.been.called;
        });
        it("Does not start when a pomodoro is already started", async () => {
            settings.get.resolves(aMob());
            store.get.withArgs('test-mob-pomodoro').returns({
                formatVersion: 1,
                start: new Date(),
                length: 30
            });

            await pomodoro.get().turnStarted('test-mob', new Date());

            expect(store.save).to.not.have.been.called;
        });
    });
});