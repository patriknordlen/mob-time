class Turn {
    constructor(lengthInSeconds = 0, startTime = new Date(), rotated = false) {
        this.lengthInSeconds = lengthInSeconds;
        this.startTime = startTime;
        this.rotated = rotated;
    }

    getState() {
        return {
            lengthInMinutes: this.lengthInSeconds / 60,
            timeLeftInMillis: this.timeLeft()
        };
    }

    timeLeft() {
        return Math.max(0, this.timeLeftInMillis());
    }

    timeLeftInMillis() {
        return this.lengthInSeconds * 1000 - this.elapsedMs();
    }

    elapsedMs() {
        return Math.max(0, new Date() - this.startTime);
    }
}

module.exports = Turn;