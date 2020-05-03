const store = require("../../../src/back/stores/stores").get();
const pomodoro = require("../../../src/back/pomodoro/pomodoro");
const settings = require("../../../src/back/mob/settings");
const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const expect = chai.expect;
chai.use(sinonChai);

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
            store.get.withArgs('test-mob-pomodoro').returns(null);

            await pomodoro.get().turnStarted('test-mob', new Date("2020-05-03T16:09:55.587Z"));

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
            store.get.withArgs('test-mob-pomodoro').returns(JSON.stringify({
                formatVersion: 1,
                start: new Date(),
                length: 30
            }));

            await pomodoro.get().turnStarted('test-mob', new Date());

            expect(store.save).to.not.have.been.called;
        });
    });

    describe("status", () => {

        it("contains the ratio of the current pomodoro", async () => {
            settings.get.resolves(aMob());
            let now = new Date();
            store.get.withArgs('test-mob-pomodoro').returns(JSON.stringify({
                formatVersion: 1,
                start: new Date(now.getTime() - 10 * 60_000),
                length: 30
            }));

            let status = await pomodoro.get().status("test-mob");

            expect(status.ratio).to.be.equal(.3333);
        });

        it("is null when the feature is off", async () => {
            process.env.FEATURES = "";

            let status = await pomodoro.get().status("test-mob");

            expect(status).to.be.null;
        });

        it("is null when pomodoro is off for the mob", async () => {
            let mob = aMob();
            mob.pomodoro.active = false;
            settings.get.resolves(mob);

            let status = await pomodoro.get().status("test-mob");

            expect(status).to.be.null;
        });

        it("is null when there is no pomodoro in progress", async () => {
            settings.get.resolves(aMob());
            store.get.withArgs('test-mob-pomodoro').returns(null);

            let status = await pomodoro.get().status("test-mob");

            expect(status).to.be.null;
        });
    });
});

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