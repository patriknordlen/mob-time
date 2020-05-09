const allTurns = require("./turn/allTurns");
const allSettings = require("./allSettings");
const pomodoro = require("./pomodoro/facade");
const slugify = require("slugify");

exports.start = app => {
    app.get("/", (req, res) => res.render("home.pug"));

    app.post("/", (req, res) => {
        const mobName = slugify(req.body.mobName);
        allSettings
            .get(mobName)
            .then(settings => allSettings
                .save(mobName, settings)
                .then(_ => res.redirect("/" + mobName)));
    });

    app.get("/index.html", (req, res) => res.redirect("/"));

    app.get("/:mob", (req, res) =>
        allSettings.get(req.params.mob)
                   .then(settings => {
                       const data = {
                           mobName: req.params.mob,
                           mods: req.query.mods,
                           length: settings.lengthInMinutes,
                           pomodoro: {
                               featureOn: pomodoro.featureOn(),
                               active: settings.pomodoro.active,
                               turns: settings.pomodoro.turns,
                           }
                       };
                       return res.render("mob.pug", data);
                   })
                   .catch(_ => {
                       res.status(404);
                       return res.render("404.pug",
                           {message: "The new-room mob does not seem to exist. You can create it from <a href=\"/\">the home page</a>."}
                       );
                   }));

    app.get("/:mob/status", async (req, res) => {
        let turn = await allTurns.get(req.params.mob);
        let data = turn.getState();
        data["pomodoro"] = await pomodoro.get().status(req.params.mob);
        return res.json(data);
    });
};