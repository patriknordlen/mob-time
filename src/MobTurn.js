class MobTurn {
    constructor(lengthInMinutes) {
        this.lengthInSeconds = lengthInMinutes * 60;
        this.elapsedMs = 0;
        this.startTime = new Date();
        let self = this;
        this.timer = setInterval(() => self.elapsedMs = new Date() - self.startTime, 100);
    }

    timeLeftInMillis() {
        return this.lengthInSeconds * 1000 - this.elapsedMs;
    }

    timeLeft() {
        let millis = this.timeLeftInMillis();
        let seconds = millis / 1000;
        return {
            millis: millis,
            minutes: Math.floor(seconds / 60),
            seconds: Math.floor(seconds % 60),
        };
    }
}
module.exports = MobTurn;