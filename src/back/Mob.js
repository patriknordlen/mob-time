const MobTurn = require("./MobTurn");

class Mob {
    constructor(mobTurn = new MobTurn(), name = "general") {
        this.name = name;
        this.mobTurn = mobTurn;
    }

    getState() {
        return this.mobTurn.getState();
    }

    timeLeft() {
        return this.mobTurn.timeLeft();
    }

    timeLeftInMillis() {
        return this.mobTurn.timeLeftInMillis();
    }

    elapsedMs() {
        return this.mobTurn.elapsedMs();
    }
}
module.exports = Mob;