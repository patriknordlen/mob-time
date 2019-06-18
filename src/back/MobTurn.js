class MobTurn {
    constructor(lengthInMinutes) {
        this.lengthInSeconds = lengthInMinutes * 60;
        this.elapsedMs = 0;
        this.startTime = new Date();
        let self = this;
        this.timer = setInterval(() => self.updateTime(), 100);
    }

    updateTime() {
        this.elapsedMs = Math.max(0, new Date() - this.startTime);
        if (this.elapsedMs === 0) {
            clearInterval(this.timer);
        }
    }

    timeLeftInMillis() {
        return this.lengthInSeconds * 1000 - this.elapsedMs;
    }

    timeLeft() {
        return Math.max(0, this.timeLeftInMillis());
    }
}
module.exports = MobTurn;