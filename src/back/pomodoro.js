exports.get = function() {
    const features = process.env.FEATURES || "";
    if (features.includes("pomodoro")) return new Pomodoro();
    return new Off();
};

class Pomodoro {
    status() {
        return {};
    }
}
class Off {
    status() {
        return null;
    }
}