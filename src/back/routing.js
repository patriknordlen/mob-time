const mobTurns = require("./mob/mob_turns");
const mobSettings = require("./mob/mob_settings");
const pomodoro = require("./pomodoro").get();

exports.start = app => {
    app.get("/", (req, res) => res.render("home.pug"));
    app.get("/index.html", (req, res) => res.redirect("/"));
    app.get("/:mob", (req, res) => mobSettings.getLength(req.params.mob)
                                              .then(length => res.render("mob.pug", {
                                                  mobName: req.params.mob,
                                                  pomodoro: pomodoro.status(),
                                                  length
                                              })));
    app.get("/:mob/status", (req, res) => mobTurns.get(req.params.mob)
                                                  .then(mob => res.json(mob.getState())));
};