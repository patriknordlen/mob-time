const allTurns = require("./turn/allTurns");
const allSettings = require("./settings/allSettings");
const breaks = require("./breaks/facade");
let features = require("./features/facade");
const slugify = require("slugify");

exports.start = app => {
    app.get("/", (req, res) => res.render("home.pug"));

    app.post("/", async (req, res) => {
        const mobName = slugify(req.body.mobName);
        let settings = await allSettings.get(mobName);
        await allSettings.save(mobName, settings);
        res.redirect("/" + mobName);
    });

    app.get("/index.html", (req, res) => res.redirect("/"));

    app.get("/:mob", async (req, res) => {
        let mobName = req.params.mob;
        let settings = await allSettings.get(mobName);
        if (!settings) {
            return notFound(mobName, res);
        }
        let mods = req.query.mods;
        await features.activate(mods, mobName);

        let data = {
            mobName: mobName,
            mods: mods,
            length: settings.lengthInMinutes,
            members: settings.members,
            memberList: settings.members.join(","),
            breaks: {
                turns: settings.breaks.turns,
                remainingTurns: settings.remainingTurns
            }
        };
        return res.render("mob/mob.pug", data);
    });
};

function notFound(mobName, res) {
    res.status(404);
    return res.render("404.pug",
        {message: `The ${mobName} mob does not seem to exist. You can create it from <a href="/">the home page</a>.`}
    );
}


