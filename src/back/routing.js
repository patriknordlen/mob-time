const mobTurns = require("./mob/mob_turns");
const mobSettings = require("./mob/mob_settings");
const pomodoro = require("./pomodoro").get();

exports.start = app => {
    app.get("/", (req, res) => res.render("home.pug"));
    app.get("/index.html", (req, res) => res.redirect("/"));
    app.get("/:mob", (req, res) =>
        mobSettings.get(req.params.mob)
                   .then(settings => {
                       const pomodoroSettings = settings.pomodoro || { active: false, turns: 3 };
                       const data = {
                           mobName: req.params.mob,
                           length: settings.lengthInMinutes,
                           pomodoro: {
                               feature: pomodoro.status(),
                               active: pomodoroSettings.active || false,
                               turns: pomodoroSettings.turns || 3,
                           }
                       };
                       return res.render("mob.pug", data);
                   }));
    app.get("/:mob/status", (req, res) => mobTurns.get(req.params.mob)
                                                  .then(mob => res.json(mob.getState())));
};