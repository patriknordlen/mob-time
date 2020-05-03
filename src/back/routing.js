const allTurns = require("./turn/allTurns");
const allSettings = require("./allSettings");
const slugify = require("slugify");

exports.start = app => {
    app.get("/", (req, res) => res.render("home.pug"));
    app.post("/", (req, res) => {
        const mobName = slugify(req.body.mobName);
        allSettings.save(mobName).then(_ => res.redirect("/" + mobName));
    });
    app.get("/index.html", (req, res) => res.redirect("/"));
    app.get("/:mob", (req, res) =>
        allSettings.get(req.params.mob)
                   .then(settings => {
                       const data = {
                           mobName: req.params.mob,
                           length: settings.lengthInMinutes,
                           pomodoro: {
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
        return res.json(turn.getState());
    });
};