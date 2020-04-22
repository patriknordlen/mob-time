const mobTurns = require("./mob/mob_turns");
const mobSettings = require("./mob/mob_settings");
const pomodoro = require("./pomodoro").get();
const slugify = require("slugify");

exports.start = app => {
    app.get("/", (req, res) => res.render("home.pug"));
    app.post("/", (req, res) => res.redirect("/" + slugify(req.body.mobName)));
    app.get("/index.html", (req, res) => res.redirect("/"));
    app.get("/:mob", (req, res) =>
        mobSettings.get(req.params.mob)
                   .then(settings => {
                       const data = {
                           mobName: req.params.mob,
                           length: settings.lengthInMinutes,
                           pomodoro: {
                               feature: pomodoro.status(),
                               active: settings.pomodoro.active,
                               turns: settings.pomodoro.turns,
                           }
                       };
                       return res.render("mob.pug", data);
                   }));
    app.get("/:mob/status", (req, res) => mobTurns.get(req.params.mob)
                                                  .then(mob => res.json(mob.getState())));
};